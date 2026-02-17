-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (managed by Supabase Auth, but usually we extend it or use public.profiles for user data linked to auth.users)
-- We'll use public.profiles for user data linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text default 'user' check (role in ('user', 'admin')),
  plan text default 'free' check (plan in ('free', 'pro', 'premium')),
  is_pro boolean default false,
  full_name text,
  phone text,
  location text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- Resumes table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  template_id text default 'modern',
  content jsonb default '{}'::jsonb,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.resumes enable row level security;

-- Subscriptions Table
create table public.subscriptions (
  id text primary key, -- Stripe Subscription ID
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')),
  plan_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

-- Policies

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Resumes
create policy "Users can view own resumes." on public.resumes for select using (auth.uid() = user_id);
create policy "Users can insert own resumes." on public.resumes for insert with check (auth.uid() = user_id);
create policy "Users can update own resumes." on public.resumes for update using (auth.uid() = user_id);
create policy "Users can delete own resumes." on public.resumes for delete using (auth.uid() = user_id);

-- Subscriptions
create policy "Users can view own subscription." on public.subscriptions for select using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
