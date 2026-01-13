-- Create a table for airdrops
create table if not exists airdrops (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  ticker text,
  logo_url text,
  status text not null check (status in ('active', 'upcoming', 'ended')),
  description text,
  est_value text,
  chain text,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  participants_count integer default 0,
  date timestamp with time zone,
  instruction text,
  website text,
  twitter text,
  discord text,
  telegram text,
  funding text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table airdrops enable row level security;

-- Create user_roles table
create table if not exists user_roles (
  user_id uuid references auth.users(id) primary key,
  role text not null check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for user_roles
alter table user_roles enable row level security;

-- Policies for airdrops
-- Everyone can read airdrops
create policy "Everyone can view airdrops"
  on airdrops for select
  using (true);

-- Only admins can insert/update/delete airdrops
create policy "Admins can insert airdrops"
  on airdrops for insert
  with check (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admins can update airdrops"
  on airdrops for update
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admins can delete airdrops"
  on airdrops for delete
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Policies for user_roles
-- Users can view their own role
create policy "Users can view their own role"
  on user_roles for select
  using (auth.uid() = user_id);

-- Only admins (or initial setup) can manage roles
-- For simplicity, we'll allow users to read all roles to check admin status if needed, 
-- but strictly speaking, 'Users can view their own role' is safer. 
-- To check if *I* am an admin, I just need to query my own row.

-- Helper to make the first user an admin (Run this manually if needed, or insert via SQL editor)
-- insert into user_roles (user_id, role) values ('YOUR_USER_ID', 'admin');
