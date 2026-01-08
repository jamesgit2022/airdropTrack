-- Create a table for tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  text text not null,
  completed boolean default false,
  type text not null, -- 'daily', 'note', 'waitlist', 'testnet'
  status text not null, -- 'early', 'ongoing', 'ended'
  created_at bigint not null,
  completed_at bigint,
  link text,
  website text,
  twitter text,
  discord text,
  telegram text,
  description text,
  
  -- Add constraints or indexes if needed
  constraint tasks_type_check check (type in ('daily', 'note', 'waitlist', 'testnet')),
  constraint tasks_status_check check (status in ('early', 'ongoing', 'ended'))
);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;

-- Create policies (drop first to allow re-running)
drop policy if exists "Users can create their own tasks" on tasks;
create policy "Users can create their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view their own tasks" on tasks;
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on tasks;
create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on tasks;
create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Create a table for user settings (reset time, etc.)
create table if not exists user_settings (
  user_id uuid references auth.users(id) primary key,
  custom_reset_time jsonb default '{"hour": 0, "minute": 0}'::jsonb,
  last_reset_date text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for settings
alter table user_settings enable row level security;

drop policy if exists "Users can insert their own settings" on user_settings;
create policy "Users can insert their own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view their own settings" on user_settings;
create policy "Users can view their own settings"
  on user_settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own settings" on user_settings;
create policy "Users can update their own settings"
  on user_settings for update
  using (auth.uid() = user_id);
