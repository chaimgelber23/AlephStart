-- AlephStart Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  current_level INTEGER NOT NULL DEFAULT 1,
  nusach TEXT NOT NULL DEFAULT 'ashkenaz' CHECK (nusach IN ('ashkenaz', 'sefard', 'edot')),
  daily_goal_minutes INTEGER NOT NULL DEFAULT 5,
  transliteration_mode TEXT NOT NULL DEFAULT 'full' CHECK (transliteration_mode IN ('full', 'faded', 'tap', 'off')),
  audio_speed REAL NOT NULL DEFAULT 1.0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_practice_date DATE,
  total_study_minutes INTEGER NOT NULL DEFAULT 0,
  total_words_mastered INTEGER NOT NULL DEFAULT 0,
  learning_goal TEXT NOT NULL DEFAULT 'daven' CHECK (learning_goal IN ('daven', 'learn', 'explore', 'all')),
  hebrew_level TEXT NOT NULL DEFAULT 'none' CHECK (hebrew_level IN ('none', 'some_letters', 'read_slow', 'read_improve')),
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.user_profiles
  FOR DELETE USING (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Skill progress
CREATE TABLE public.skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  mastery_level REAL NOT NULL DEFAULT 0,
  times_practiced INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skill progress" ON public.skill_progress
  FOR ALL USING (auth.uid() = user_id);

-- Daily sessions
CREATE TABLE public.daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  items_reviewed INTEGER NOT NULL DEFAULT 0,
  items_correct INTEGER NOT NULL DEFAULT 0,
  new_skills_learned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily sessions" ON public.daily_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Milestones
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, type)
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own milestones" ON public.milestones
  FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_skill_progress_user ON public.skill_progress(user_id);
CREATE INDEX idx_daily_sessions_user_date ON public.daily_sessions(user_id, date);
CREATE INDEX idx_milestones_user ON public.milestones(user_id);
