-- ============================================================
-- Drago Pharma — Admin & site-content migration
-- Run this AFTER schema.sql (Supabase SQL editor or `supabase db push`)
-- ============================================================

-- ============================================================
-- ADMIN FLAG ON PROFILES
-- ============================================================
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ============================================================
-- SITE CONTENT  (key/value store the admin panel edits;
-- the homepage — and later other pages — read from this instead
-- of hardcoded copy)
-- ============================================================
create table if not exists public.site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read site content" on public.site_content
  for select using (true);

create policy "Admins can write site content" on public.site_content
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can update site content" on public.site_content
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can delete site content" on public.site_content
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ============================================================
-- ADMIN OVERRIDE POLICIES — give admins full read/write on the
-- tables a store needs to manage (products, categories, orders).
-- These are ADDITIVE to the existing policies in schema.sql.
-- ============================================================

create policy "Admins can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can read all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can update orders" on public.orders
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can read all order items" on public.order_items
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ============================================================
-- SEED — default homepage content (safe to re-run)
-- ============================================================
insert into public.site_content (key, value) values (
  'home',
  '{
    "hero": {
      "eyebrow": "Research Peptides & Custom Synthesis",
      "title": "Peptides for Revitalization & Health",
      "subtitle": "Drago Pharma supplies high-purity peptides synthesized for laboratory and investigational research, with bulk supply and custom synthesis available.",
      "primary_cta_label": "Shop Peptides",
      "primary_cta_link": "/shop",
      "secondary_cta_label": "Request a Quote",
      "secondary_cta_link": "/contact-us"
    },
    "trust_badges": ["Third-Party Tested", "Ships in 24h", "USA Based Lab", ">99% Purity", "10,000+ Orders Fulfilled", "Secure Checkout"],
    "stats": [
      { "label": "Research Peptides", "value": 40, "suffix": "+" },
      { "label": "Countries Shipped", "value": 25, "suffix": "+" },
      { "label": "Orders Fulfilled", "value": 12000, "suffix": "+" },
      { "label": "Avg. Purity", "value": 99, "suffix": "%" }
    ],
    "features": [
      { "icon": "\ud83e\uddea", "title": "Third-Party Tested", "text": "Every batch is verified by an independent lab for purity and identity before it ships." },
      { "icon": "\ud83d\ude9a", "title": "Fast, Discreet Shipping", "text": "Orders ship within 24 hours in unmarked, temperature-safe packaging." },
      { "icon": "\ud83d\udd12", "title": "Secure Checkout", "text": "Encrypted payments and privacy-first order handling, every time." },
      { "icon": "\ud83e\uddec", "title": "Custom Synthesis", "text": "Need a specific sequence or quantity? Our lab can synthesize to spec." }
    ],
    "testimonials": [
      { "quote": "Consistent purity batch after batch, and support actually answers questions fast.", "author": "M. Alvarez", "role": "Verified Buyer" },
      { "quote": "Packaging is careful and shipping was quicker than I expected.", "author": "J. Whitfield", "role": "Verified Buyer" },
      { "quote": "COAs are posted for every batch \u2014 exactly what I look for in a supplier.", "author": "R. Chen", "role": "Lab Researcher" }
    ],
    "promo": { "enabled": true, "text": "Free shipping on all orders over $150", "link_label": "Shop Now", "link": "/shop" },
    "newsletter": { "title": "Stay in the loop", "subtitle": "Get restock alerts, new COAs, and research notes \u2014 no spam." }
  }'::jsonb
)
on conflict (key) do nothing;

-- ============================================================
-- To make a user an admin, run (after they have signed up):
--   update public.profiles set is_admin = true where id = '<their-auth-user-uuid>';
-- ============================================================
