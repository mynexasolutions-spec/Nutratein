-- ============================================================
-- Fix: infinite recursion in "Admins can read all profiles" policy
-- Run this in the Supabase SQL editor.
-- ============================================================

-- 1. A helper function that checks admin status while BYPASSING RLS
--    (security definer runs with the privileges of the function owner,
--    not the calling user, so it doesn't re-trigger the profiles policies).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Let any authenticated/anon role call it (the function itself is safe;
-- it only ever reveals a boolean about the calling user).
grant execute on function public.is_admin() to authenticated, anon;

-- 2. Drop and recreate every policy that queried profiles-from-profiles
--    (or any other table) using the old recursive subquery pattern.
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles" on public.profiles
  for select using (public.is_admin());

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders" on public.orders
  for select using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
  for update using (public.is_admin());

drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items" on public.order_items
  for select using (public.is_admin());

drop policy if exists "Admins can write site content" on public.site_content;
create policy "Admins can write site content" on public.site_content
  for insert with check (public.is_admin());

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content" on public.site_content
  for update using (public.is_admin());

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content" on public.site_content
  for delete using (public.is_admin());
