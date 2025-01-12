-- Create the new profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  available_tokens integer not null default 0,
  monthly_usage integer not null default 0,
  last_usage_reset timestamp not null default now(),
  stripe_customer_id text,
  subscription_tier text not null default 'FREE'
    check (subscription_tier in ('FREE', 'PRO', 'ENTERPRISE')),
  role text not null default 'user'
    check (role in ('user', 'admin'))
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Migrate data from users table if it exists
do $$
begin
  if exists (select from information_schema.tables where table_name = 'users') then
    insert into public.profiles (
      id,
      available_tokens,
      monthly_usage,
      last_usage_reset,
      stripe_customer_id,
      subscription_tier,
      role
    )
    select
      id,
      available_tokens,
      monthly_usage,
      last_usage_reset,
      stripe_customer_id,
      subscription_tier,
      role
    from public.users;
  end if;
end $$;

-- Update foreign keys to reference profiles instead of users
alter table if exists public.token_transactions
  drop constraint if exists token_transactions_user_id_fkey,
  add constraint token_transactions_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table if exists public.qa_entries
  drop constraint if exists qa_entries_user_id_fkey,
  add constraint qa_entries_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table if exists public.email_accounts
  drop constraint if exists email_accounts_user_id_fkey,
  add constraint email_accounts_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table if exists public.email_subscriptions
  drop constraint if exists email_subscriptions_user_id_fkey,
  add constraint email_subscriptions_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table if exists public.question_analytics
  drop constraint if exists question_analytics_user_id_fkey,
  add constraint question_analytics_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table if exists public.integrations
  drop constraint if exists integrations_user_id_fkey,
  add constraint integrations_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

-- Create trigger to create profile on user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Create trigger if it doesn't exist
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Drop the old users table if it exists
drop table if exists public.users; 