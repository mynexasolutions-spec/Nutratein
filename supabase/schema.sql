-- ============================================================
-- Drago Pharma — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

-- Extensions ---------------------------------------------------
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  short_desc    text,
  description   text,
  price         numeric(10,2) not null check (price >= 0),
  compare_price numeric(10,2),
  image_url     text,
  category_id   uuid references public.categories(id) on delete set null,
  stock         integer not null default 0,
  sku           text,
  featured      boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_slug_idx on public.products(slug);

-- ============================================================
-- PROFILES  (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  address_line1 text,
  address_line2 text,
  city        text,
  state       text,
  postal_code text,
  country     text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  status           text not null default 'pending'
                     check (status in ('pending','processing','shipped','completed','cancelled')),
  total            numeric(10,2) not null default 0,
  email            text not null,
  full_name        text not null,
  phone            text,
  shipping_address jsonb not null,
  notes            text,
  created_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  product_name text not null,   -- snapshot in case product changes later
  unit_price  numeric(10,2) not null,
  quantity    integer not null check (quantity > 0),
  line_total  numeric(10,2) not null
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.profiles   enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;

-- Categories & products: public read-only
create policy "Public can read categories" on public.categories
  for select using (true);

create policy "Public can read active products" on public.products
  for select using (is_active = true);

-- Profiles: user can read/update only their own row
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Orders: guests can create (user_id null) or a signed-in user can create their own;
-- a user can only ever read their own orders.
create policy "Anyone can create an order" on public.orders
  for insert with check (
    (auth.uid() is not null and auth.uid() = user_id)
    or (auth.uid() is null and user_id is null)
  );

create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

-- Order items follow the parent order's visibility
create policy "Anyone can insert order items for an order they created" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or (o.user_id is null and auth.uid() is null))
    )
  );

create policy "Users can view items of their own orders" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- ============================================================
-- SEED DATA — categories
-- ============================================================
insert into public.categories (name, slug, description) values
  ('Fat Loss',      'fat-loss',      'Peptides studied for lipid metabolism and fat-loss research.'),
  ('Muscle Growth', 'muscle-growth', 'Peptides studied for growth hormone and muscle-related research.'),
  ('Recovery',      'recovery',      'Peptides studied for tissue repair and recovery research.')
on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA — products (real catalog pulled from the current site)
-- ============================================================
insert into public.products (name, slug, price, image_url, category_id, stock, featured, short_desc)
select v.name, v.slug, v.price, v.image_url, c.id, 100, v.featured, v.short_desc
from (values
  ('Follistatin',                'follistatin',        149.95, '/images/follistatin-1-300x300.webp', 'muscle-growth', true,  'Research peptide studied for muscle-related pathways.'),
  ('FRAG 176-191',               'frag-176-191',        34.95, '/images/fragment-1-300x300.webp',     'fat-loss',      true,  'Fragment peptide studied in fat-metabolism research.'),
  ('TB-500 (Thymosin Beta-4) – 5mg', 'tb-500',           38.95, '/images/tb-500-2-300x300.webp',       'recovery',      false, 'Peptide studied for tissue repair and recovery research.'),
  ('PEG MGF – 2mg',              'peg-mgf',             47.95, '/images/PEG-MGF-1-300x300.webp',      'muscle-growth', false, 'Modified growth factor peptide for muscle research.'),
  ('Retatrutide',                'retatrutide',        179.95, '/images/retatrutide-300x300.webp',    'fat-loss',      false, 'Multi-agonist peptide studied in metabolic research.'),
  ('IGF-1 LR3',                  'igf-1-lr3',           69.95, '/images/igf-1lr3-300x300.webp',       'muscle-growth', false, 'Long-acting IGF-1 analog for research use.'),
  ('GHRP-2',                     'ghrp-2',              24.95, '/images/GHRP-2-300x300.webp',         'muscle-growth', false, 'Growth-hormone-releasing peptide for research use.'),
  ('FTPP',                       'ftpp',                99.95, '/images/FTTP-300x300.webp',           'fat-loss',      false, 'Peptide studied for fat-loss related pathways.'),
  ('BPC-157 – 5mg',              'bpc-157',             49.99, '/images/bpc-157-300x300.webp',        'recovery',      true,  'Widely studied peptide for tissue repair research.'),
  ('CJC-1295 (No DAC) – 2mg',    'cjc-1295-no-dac',     42.95, '/images/1295-300x300.webp',           'muscle-growth', false, 'GHRH analog studied for growth-hormone research.'),
  ('CJC-1295 with DAC – 2mg',    'cjc-1295-with-dac',   47.95, '/images/cjc-1295-with-dac-300x300.webp','muscle-growth', false, 'Long-acting GHRH analog for research use.')
) as v(name, slug, price, image_url, category_slug, featured, short_desc)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
