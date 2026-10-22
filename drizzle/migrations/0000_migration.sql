create type public.app_role as enum ('admin','moderator','user');
create type public.account_type as enum ('buyer','seller','both');
create type public.listing_status as enum ('draft','pending_review','approved','rejected','under_offer','sold','withdrawn','expired');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  country text,
  bio text,
  account_type public.account_type not null default 'both',
  binance_pay_id text,
  usdt_wallet text,
  is_verified_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- public profile read exposes only via view; table read own/admin
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and is_verified_seller = (select p.is_verified_seller from public.profiles p where p.id = auth.uid()));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
revoke select on public.profiles from anon;

create view public.public_profiles with (security_invoker = false) as
  select id, full_name, avatar_url, country, bio, is_verified_seller, created_at from public.profiles;
grant select on public.public_profiles to anon, authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, account_type)
  values (new.id, new.raw_user_meta_data->>'full_name',
    coalesce(nullif(new.raw_user_meta_data->>'account_type','')::public.account_type, 'both'));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
exception when others then
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public" on public.categories for select to anon, authenticated using (true);
create policy "admins manage categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  seller_id uuid,
  seller_name text,
  seller_country text,
  seller_rating numeric(2,1) default 0,
  category_id uuid references public.categories(id),
  title text not null,
  tagline text,
  description text not null default '',
  status public.listing_status not null default 'draft',
  rejection_reason text,
  asking_price numeric(12,2) not null default 0,
  buy_now_price numeric(12,2),
  monthly_revenue numeric(12,2) not null default 0,
  monthly_profit numeric(12,2) not null default 0,
  monthly_traffic int not null default 0,
  age_months int not null default 0,
  monetization text[] not null default '{}',
  tech_stack text[] not null default '{}',
  country text,
  included text[] not null default '{}',
  revenue_history jsonb not null default '[]',
  cover_image text,
  is_featured boolean not null default false,
  is_verified boolean not null default false,
  nda_required boolean not null default false,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;
grant all on public.listings to service_role;
alter table public.listings enable row level security;
create policy "live listings public" on public.listings for select to anon, authenticated using (status in ('approved','under_offer','sold'));
create policy "owner reads own" on public.listings for select to authenticated using (seller_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "owner inserts" on public.listings for insert to authenticated with check (seller_id = auth.uid() and status in ('draft','pending_review'));
create policy "owner updates draft" on public.listings for update to authenticated using (seller_id = auth.uid() and status in ('draft','rejected','pending_review')) with check (seller_id = auth.uid() and status in ('draft','pending_review','withdrawn'));
create policy "admin all listings" on public.listings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create index on public.listings(status);
create index on public.listings(category_id);

create table public.listing_private (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  url text,
  notes text
);
grant select, insert, update on public.listing_private to authenticated;
grant all on public.listing_private to service_role;
alter table public.listing_private enable row level security;
create policy "owner or admin private" on public.listing_private for all to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()) or public.has_role(auth.uid(),'admin'))
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()) or public.has_role(auth.uid(),'admin'));

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);
grant select on public.listing_images to anon, authenticated;
grant insert, update, delete on public.listing_images to authenticated;
grant all on public.listing_images to service_role;
alter table public.listing_images enable row level security;
create policy "images follow listing" on public.listing_images for select to anon, authenticated using (exists (select 1 from public.listings l where l.id = listing_id));
create policy "owner manages images" on public.listing_images for all to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and (l.seller_id = auth.uid() or public.has_role(auth.uid(),'admin'))))
  with check (exists (select 1 from public.listings l where l.id = listing_id and (l.seller_id = auth.uid() or public.has_role(auth.uid(),'admin'))));

create table public.watchlist (
  user_id uuid not null,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
grant select, insert, delete on public.watchlist to authenticated;
grant all on public.watchlist to service_role;
alter table public.watchlist enable row level security;
create policy "own watchlist" on public.watchlist for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.settings (
  key text primary key,
  value jsonb not null
);
grant select on public.settings to anon, authenticated;
grant insert, update on public.settings to authenticated;
grant all on public.settings to service_role;
alter table public.settings enable row level security;
create policy "public settings read" on public.settings for select to anon, authenticated using (key in ('fee_percent','auto_approve_days','payment_deadline_hours','announcement'));
create policy "admin settings" on public.settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.settings values
 ('fee_percent','10'),('auto_approve_days','5'),('payment_deadline_hours','48'),('announcement','""'),
 ('binance','{"pay_id":"","wallets":[{"network":"TRC20","address":""},{"network":"BEP20","address":""}]}');

create or replace function public.increment_listing_view(_id uuid) returns void language sql security definer set search_path = public as $$
  update public.listings set view_count = view_count + 1 where id = _id and status in ('approved','under_offer','sold');
$$;
grant execute on function public.increment_listing_view(uuid) to anon, authenticated;

insert into public.categories (slug,name,description,icon,sort_order) values
 ('websites','Websites','Content sites, blogs and niche properties','Globe',1),
 ('saas','SaaS','Subscription software businesses','Cloud',2),
 ('ecommerce','E-commerce','Online stores and DTC brands','ShoppingBag',3),
 ('apps','Mobile Apps','iOS and Android applications','Smartphone',4),
 ('domains','Domains','Premium domain names','AtSign',5),
 ('newsletters','Newsletters','Email audiences and media','Mail',6);

with c as (select slug, id from public.categories)
insert into public.listings (slug,seller_name,seller_country,seller_rating,category_id,title,tagline,description,status,asking_price,buy_now_price,monthly_revenue,monthly_profit,monthly_traffic,age_months,monetization,tech_stack,country,included,revenue_history,is_featured,is_verified,cover_image) values
('trailgear-reviews',(select 'Amir Khan'),'Pakistan',4.9,(select id from c where slug='websites'),'TrailGear Reviews','Outdoor gear review site with evergreen affiliate traffic','A 4-year-old outdoor equipment review site ranking for 2,300+ keywords. Revenue from Amazon Associates and direct brand partnerships. Fully outsourced content team in place.','approved',84000,95000,3100,2600,61000,48,'{Affiliate,Display Ads}','{WordPress}','United States','{Domain,Content,Email list,Social accounts}','[2200,2400,2500,2700,2900,3100]',true,true,'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200'),
('invoicely-saas','Sara Lind','Sweden',4.8,(select id from c where slug='saas'),'Invoicely','Invoicing SaaS for freelancers with 420 paying users','B2B micro-SaaS that automates invoicing and reminders. Low churn (2.1%), Stripe billing, clean Next.js codebase with tests.','approved',210000,null,7800,6400,18000,30,'{Subscriptions}','{Next.js,PostgreSQL,Stripe}','Sweden','{Codebase,Domain,Customer list,Support docs}','[5900,6300,6800,7100,7500,7800]',true,true,'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200'),
('bloom-botanics','Lena Ortiz','Spain',4.7,(select id from c where slug='ecommerce'),'Bloom Botanics','Shopify store selling dried flower arrangements','DTC brand with repeat buyers, 38% returning customer rate. Supplier contracts transferable. Instagram with 41k followers.','approved',56000,62000,9400,2100,24000,26,'{Product sales}','{Shopify}','Spain','{Store,Inventory,Supplier contacts,Social accounts}','[7800,8200,8600,9100,8900,9400]',true,false,'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200'),
('focusflow-app','Daniel Okafor','Nigeria',4.6,(select id from c where slug='apps'),'FocusFlow','Pomodoro productivity app, 120k downloads','Cross-platform React Native focus timer with premium subscription tier. 4.7 star rating on both stores.','approved',38000,null,1650,1400,0,22,'{Subscriptions,In-app purchases}','{React Native,Firebase}','Nigeria','{Source code,Store listings,Design files}','[1100,1200,1350,1450,1550,1650]',false,true,'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200'),
('fintrack-domain','Mark Ellis','United Kingdom',4.9,(select id from c where slug='domains'),'FinTrack.io','Brandable fintech domain','Short, memorable .io domain ideal for a personal finance or expense-tracking startup. Registered since 2016.','approved',12500,12500,0,0,0,96,'{}','{}','United Kingdom','{Domain}','[]',false,true,'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200'),
('daily-dev-digest','Priya Raman','India',4.8,(select id from c where slug='newsletters'),'Daily Dev Digest','Developer newsletter with 28k subscribers','Curated daily newsletter for software engineers, 46% open rate. Sponsorships booked 6 weeks out.','approved',72000,null,4200,3900,0,34,'{Sponsorships}','{Beehiiv}','India','{Subscriber list,Brand,Sponsor contacts}','[3200,3400,3600,3800,4000,4200]',true,true,'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200'),
('petcare-hub','Tom Becker','Germany',4.5,(select id from c where slug='websites'),'PetCare Hub','Pet health content site','Informational pet health site with vet-reviewed articles. Ezoic display ads plus affiliate.','approved',29000,null,1200,1050,42000,40,'{Display Ads,Affiliate}','{WordPress}','Germany','{Domain,Content}','[900,950,1000,1100,1150,1200]',false,false,'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200'),
('shiftboard-saas','Chen Wei','Singapore',4.9,(select id from c where slug='saas'),'ShiftBoard','Staff scheduling SaaS for restaurants','Scheduling and shift-swap tool used by 180 restaurants. Annual and monthly plans.','under_offer',340000,null,11200,8600,9000,44,'{Subscriptions}','{Laravel,Vue,MySQL}','Singapore','{Codebase,Domain,Customers,Integrations}','[9800,10100,10400,10700,11000,11200]',true,true,'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'),
('urban-threads','Maya Johnson','United States',4.4,(select id from c where slug='ecommerce'),'Urban Threads','Streetwear print-on-demand store','Print-on-demand apparel with zero inventory. Strong TikTok organic channel.','approved',18000,21000,4100,900,15000,14,'{Product sales}','{Shopify,Printful}','United States','{Store,Designs,Social accounts}','[2800,3200,3500,3700,3900,4100]',false,false,'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200'),
('recipebox-app','Elena Rossi','Italy',4.7,(select id from c where slug='apps'),'RecipeBox','Meal planning app with 9k MAU','Meal planner with grocery lists and ad-free premium tier.','approved',24000,null,980,820,0,28,'{Subscriptions,Ads}','{Flutter,Supabase}','Italy','{Source code,Store listings}','[700,760,820,880,930,980]',false,true,'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200'),
('greenstack-domain','Alex Moreau','France',4.6,(select id from c where slug='domains'),'GreenStack.com','Premium .com for climate tech','Two-word .com for sustainability or cloud infra brand.','approved',45000,45000,0,0,0,180,'{}','{}','France','{Domain}','[]',false,true,'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200'),
('remote-jobs-weekly','Jonas Berg','Norway',4.8,(select id from c where slug='newsletters'),'Remote Jobs Weekly','Remote job board and newsletter','Job board with paid listings plus a 15k subscriber weekly newsletter.','sold',58000,null,3300,2900,22000,38,'{Job listings,Sponsorships}','{Webflow,Memberstack}','Norway','{Site,Subscriber list,Employer contacts}','[2700,2800,3000,3100,3200,3300]',false,true,'https://images.unsplash.com/photo-1521737604893-d14cc237f11e?w=1200');
