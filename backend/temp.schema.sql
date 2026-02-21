
/*
  SUPABASE MASTER RECONSTRUCTION SCRIPT (FINAL FIXED VERSION)
  -----------------------------------------------------------
  FEATURES:
  - Auto-generated Referral Codes
  - "Lazy Reset" for Daily Spins (Resets on app load)
  - Robust Daily Check-in (Handles "Yesterday" logic correctly)
  - Self-Healing Profile Fetching
  - Seed Data for Games, Prizes, and Rewards
*/

-- ==========================================
-- 1. CLEANUP (Drop everything to start fresh)
-- ==========================================
-- We use CASCADE to automatically remove dependent Views, Triggers, and RLS policies.
DROP TABLE IF EXISTS public.leaderboard CASCADE;
DROP TABLE IF EXISTS public.featured_games CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.daily_reward_claims CASCADE;
DROP TABLE IF EXISTS public.daily_rewards_config CASCADE;
DROP TABLE IF EXISTS public.spin_wheel_prizes CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop Functions to ensure clean logic updates
DROP FUNCTION IF EXISTS public.generate_unique_referral_code CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.get_my_player_data CASCADE;
DROP FUNCTION IF EXISTS public.play_lucky_spin CASCADE;
DROP FUNCTION IF EXISTS public.claim_daily_reward CASCADE;

-- Drop Enums
DROP TYPE IF EXISTS game_category CASCADE;
DROP TYPE IF EXISTS game_orientation CASCADE;

-- Cleanup specific Storage Policies (Optional, safe to run)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;

-- ==========================================
-- 2. CREATE TYPES
-- ==========================================
CREATE TYPE game_category AS ENUM (
  'Puzzle', 'Action', 'Strategy', 'Racing', 
  'Sports', 'Adventure', 'Casual', 'Arcade', 'All'
);

CREATE TYPE game_orientation AS ENUM ('landscape', 'portrait');

-- ==========================================
-- 3. STORAGE CONFIGURATION
-- ==========================================
-- Ensures the 'assets' bucket exists for game images/avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('assets', 'assets', true, 5242880, '{image/*}')
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{image/*}';

-- ==========================================
-- 4. HELPER FUNCTIONS
-- ==========================================

-- Function to generate unique 6-character referral code
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code(length INT DEFAULT 6)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..length LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    -- Check uniqueness safely
    BEGIN
      PERFORM 1 FROM public.profiles WHERE referral_code = result;
      IF FOUND THEN exists_check := true; ELSE exists_check := false; END IF;
    EXCEPTION WHEN undefined_table THEN
      exists_check := false;
    END;

    IF NOT exists_check THEN RETURN result; END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 5. CREATE TABLES
-- ==========================================

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  name TEXT, 
  avatar_url TEXT,
  coins INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  total_games_played INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE DEFAULT public.generate_unique_referral_code(),
  
  -- Game Specific Stats
  daily_spins_left INTEGER DEFAULT 3,
  last_spin_date TIMESTAMPTZ DEFAULT '2000-01-01', -- Default to old date to force reset
  last_check_in TIMESTAMPTZ DEFAULT '2000-01-01',
  
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GAMES
CREATE TABLE public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  url TEXT NOT NULL,
  orientation game_orientation DEFAULT 'portrait',
  description TEXT,
  category game_category,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEATURED GAMES
CREATE TABLE public.featured_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BANNERS
CREATE TABLE public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  href TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DAILY REWARDS CONFIG
CREATE TABLE public.daily_rewards_config (
  day_number INTEGER PRIMARY KEY,
  reward_amount INTEGER NOT NULL
);

-- SPIN WHEEL PRIZES
CREATE TABLE public.spin_wheel_prizes (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  value INTEGER NOT NULL,
  probability_percentage INTEGER DEFAULT 0
);

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  reward_coins INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER ACHIEVEMENTS
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0,
  is_claimed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- REFERRALS
CREATE TABLE public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id),
  referred_user_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending',
  reward_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLAIMS LOG
CREATE TABLE public.daily_reward_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  day_number INTEGER NOT NULL,
  reward_amount INTEGER NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. VIEWS
-- ==========================================
CREATE VIEW public.leaderboard AS
SELECT 
  id AS user_id,
  username,
  avatar_url,
  coins,
  RANK() OVER (ORDER BY coins DESC) AS rank
FROM public.profiles;

-- ==========================================
-- 7. RLS POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rewards_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_wheel_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public Read Only Tables
CREATE POLICY "Public Read Games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public Read Featured" ON public.featured_games FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON public.daily_rewards_config FOR SELECT USING (true);
CREATE POLICY "Public Read Prizes" ON public.spin_wheel_prizes FOR SELECT USING (true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);

-- User Specific
CREATE POLICY "Users Read Own Achievement Progress" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Storage
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'assets' );
CREATE POLICY "Authenticated Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'assets' AND auth.uid() = owner );
CREATE POLICY "Owner Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'assets' AND auth.uid() = owner );
CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'assets' AND auth.uid() = owner );

-- ==========================================
-- 8. INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_games_category ON public.games(category);
CREATE INDEX IF NOT EXISTS idx_games_title ON public.games USING GIN (to_tsvector('english', title));

-- ==========================================
-- 9. LOGIC FUNCTIONS (THE FIXES)
-- ==========================================

-- A. Auto-create Profile on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, username, coins, daily_spins_left)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Player'), 
    new.raw_user_meta_data->>'avatar_url',
    new.email, 
    100, 
    3
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- B. Get Player Data (Sync & Lazy Reset Logic)
-- Calls this on App Load to reset spins if it's a new day
CREATE OR REPLACE FUNCTION public.get_my_player_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  user_prof RECORD;
  today DATE := CURRENT_DATE;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN RETURN NULL; END IF;

  SELECT * INTO user_prof FROM public.profiles WHERE id = current_user_id;

  -- 1. Self-Healing: If profile missing, create it
  IF user_prof IS NULL THEN
    INSERT INTO public.profiles (id, username, name, coins, daily_spins_left, daily_streak)
    VALUES (current_user_id, (SELECT email FROM auth.users WHERE id = current_user_id), 'Player', 100, 3, 0)
    RETURNING * INTO user_prof;
  END IF;

  -- 2. Lazy Reset: If last spin date is older than today, reset to 3
  IF user_prof.last_spin_date IS NULL OR user_prof.last_spin_date::date < today THEN
    UPDATE public.profiles 
    SET daily_spins_left = 3, last_spin_date = NOW() 
    WHERE id = current_user_id
    RETURNING * INTO user_prof;
  END IF;

  RETURN row_to_json(user_prof);
END;
$$;


-- C. Play Lucky Spin (With Double Verification)
CREATE OR REPLACE FUNCTION public.play_lucky_spin()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  user_profile RECORD;
  selected_prize RECORD;
  rand_val INTEGER;
  cumulative_sum INTEGER := 0;
  prize_pool CURSOR FOR SELECT * FROM public.spin_wheel_prizes ORDER BY id ASC;
  today DATE := CURRENT_DATE;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN RETURN json_build_object('success', false, 'message', 'Not logged in'); END IF;

  SELECT * INTO user_profile FROM public.profiles WHERE id = current_user_id FOR UPDATE;

  -- Ensure reset happened if calling spin directly
  IF user_profile.last_spin_date::date < today THEN
    UPDATE public.profiles SET daily_spins_left = 3, last_spin_date = NOW() WHERE id = current_user_id;
    user_profile.daily_spins_left := 3;
  END IF;

  IF user_profile.daily_spins_left <= 0 THEN 
    RETURN json_build_object('success', false, 'message', 'No spins left for today!'); 
  END IF;

  -- Weighted Random Selection
  rand_val := floor(random() * 100) + 1;
  FOR prize IN prize_pool LOOP
    cumulative_sum := cumulative_sum + prize.probability_percentage;
    IF rand_val <= cumulative_sum THEN selected_prize := prize; EXIT; END IF;
  END LOOP;
  IF selected_prize IS NULL THEN SELECT * INTO selected_prize FROM public.spin_wheel_prizes WHERE id = 1; END IF;

  -- Update Balance & Spins
  UPDATE public.profiles
  SET daily_spins_left = daily_spins_left - 1, coins = coins + selected_prize.value, last_spin_date = NOW()
  WHERE id = current_user_id;

  RETURN json_build_object('success', true, 'spins_left', user_profile.daily_spins_left - 1, 'reward', selected_prize.value, 'index', (selected_prize.id - 1));
END;
$$;


-- D. Claim Daily Reward (Robust Date Math Fix)
CREATE OR REPLACE FUNCTION public.claim_daily_reward()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  curr_user_id UUID;
  user_prof RECORD;
  last_check_date DATE;
  today DATE := CURRENT_DATE;
  new_streak INTEGER;
  reward_val INTEGER;
  cycle_day INTEGER;
BEGIN
  curr_user_id := auth.uid();
  IF curr_user_id IS NULL THEN RETURN json_build_object('success', false, 'message', 'Not logged in'); END IF;

  SELECT * INTO user_prof FROM public.profiles WHERE id = curr_user_id FOR UPDATE;
  last_check_date := user_prof.last_check_in::date;

  -- Check if already claimed
  IF last_check_date = today THEN 
    RETURN json_build_object('success', false, 'message', 'Already claimed today'); 
  END IF;

  -- Calculate Streak: If checked in yesterday (today - 1), increment. Else reset to 1.
  IF last_check_date = (today - INTERVAL '1 day')::date THEN 
    new_streak := COALESCE(user_prof.daily_streak, 0) + 1; 
  ELSE 
    new_streak := 1; 
  END IF;

  -- Get Reward Value
  cycle_day := ((new_streak - 1) % 7) + 1;
  SELECT reward_amount INTO reward_val FROM public.daily_rewards_config WHERE day_number = cycle_day;
  IF reward_val IS NULL THEN reward_val := 50; END IF;

  -- Update Profile
  UPDATE public.profiles
  SET daily_streak = new_streak, last_check_in = NOW(), coins = COALESCE(coins, 0) + reward_val
  WHERE id = curr_user_id;
  
  -- Log Claim
  INSERT INTO public.daily_reward_claims (user_id, day_number, reward_amount)
  VALUES (curr_user_id, cycle_day, reward_val);

  RETURN json_build_object('success', true, 'reward', reward_val, 'new_streak', new_streak);
END;
$$;

-- ==========================================
-- 10. SEED DATA
-- ==========================================

-- Games
INSERT INTO public.games (title, image, url, orientation, category, description)
VALUES 
('Om Nom Run', 'https://img.cdn.famobi.com/portal/html5games/images/tmp/OmNomRunTeaser.jpg', 'https://play.famobi.com/om-nom-run', 'portrait', 'Action', 'Join Om Nom in an exciting running adventure!'),
('Moto X3M Pool Party', 'https://img.cdn.famobi.com/portal/html5games/images/tmp/MotoX3mPoolPartyTeaser.jpg', 'https://play.famobi.com/moto-x3m-pool-party', 'landscape', 'Racing', 'Grab your motorbike and beat the clock.'),
('Bubble Tower 3D', 'https://img.cdn.famobi.com/portal/html5games/images/tmp/BubbleTower3dTeaser.jpg', 'https://play.famobi.com/bubble-tower-3d', 'landscape', 'Puzzle', 'Experience the classic bubble shooter.'),
('Table Tennis World Tour', 'https://img.cdn.famobi.com/portal/html5games/images/tmp/TableTennisWorldTourTeaser.jpg', 'https://play.famobi.com/table-tennis-world-tour', 'landscape', 'Sports', 'Pick your nation and battle your way through the World Tour.')
ON CONFLICT DO NOTHING;

-- Featured Games (Pick 5)
INSERT INTO public.featured_games (game_id, display_order, is_active)
SELECT id, row_number() OVER (ORDER BY created_at), true FROM public.games LIMIT 5
ON CONFLICT DO NOTHING;

-- Banners
INSERT INTO public.banners (title, subtitle, image, href)
VALUES 
('Spin the Wheel!', 'Win daily prizes and coins.', 'https://placehold.co/600x400/png?text=Spin+Wheel', '/lucky-spin'),
('Invite a Friend', 'Earn 500 coins for every friend you invite.', 'https://placehold.co/600x400/png?text=Invite+Friend', '/profile')
ON CONFLICT DO NOTHING;

-- Spin Wheel Prizes
INSERT INTO public.spin_wheel_prizes (id, label, icon, value, probability_percentage) VALUES 
(1, '20', 'coins', 20, 30), (2, '50', 'coins', 50, 25), (3, '100', 'coins', 100, 20),
(4, '200', 'coins', 200, 10), (5, '500', 'coins', 500, 5), (6, '1K', 'coins', 1000, 2),
(7, 'Ticket', 'ticket', 50, 8), (8, 'JACKPOT', 'trophy', 5000, 0)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value; -- Safe update
SELECT setval('public.spin_wheel_prizes_id_seq', 8, true);

-- Daily Rewards
INSERT INTO public.daily_rewards_config (day_number, reward_amount) VALUES 
(1, 50), (2, 75), (3, 100), (4, 125), (5, 150), (6, 200), (7, 500)
ON CONFLICT (day_number) DO UPDATE SET reward_amount = EXCLUDED.reward_amount;

-- Achievements
INSERT INTO public.achievements (title, description, icon, target_value, reward_coins) VALUES 
('Novice Gamer', 'Play your first 10 games', 'gamepad', 10, 50),
('Check-in Master', 'Reach a 7-day daily streak', 'calendar', 7, 200),
('High Roller', 'Accumulate 1000 coins', 'coins', 1000, 500)
ON CONFLICT DO NOTHING;

-- Backfill Users (Safe)
INSERT INTO public.profiles (id, username, name, avatar_url, coins, daily_spins_left)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Player'), 
    raw_user_meta_data->>'avatar_url',
    100, 
    3
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
