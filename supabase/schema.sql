-- Supabase Database Schema for Kids Speech Game
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Profiles table (extends Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar text default '🦁',
  level integer default 1,
  total_stars integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Game progress table
create table if not exists game_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  game_type text not null,
  games_played integer default 0,
  correct_answers integer default 0,
  total_answers integer default 0,
  highest_streak integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, game_type)
);

-- Enable RLS on game_progress
alter table game_progress enable row level security;

-- Policies for game_progress
create policy "Users can view their own progress"
  on game_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on game_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on game_progress for update
  using (auth.uid() = user_id);

-- Achievements table
create table if not exists achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  achievement text not null,
  earned_at timestamptz default now(),
  unique(user_id, achievement)
);

-- Enable RLS on achievements
alter table achievements enable row level security;

-- Policies for achievements
create policy "Users can view their own achievements"
  on achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements"
  on achievements for insert
  with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Player'), coalesce(new.raw_user_meta_data->>'avatar', '🦁'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
