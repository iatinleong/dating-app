-- =============================================
-- Spark Connect Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Profiles Table (用戶資料)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Required fields
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  birthdate DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  height INTEGER NOT NULL CHECK (height > 0 AND height < 300),
  location TEXT NOT NULL,

  -- Optional personal info
  occupation TEXT,
  salary TEXT,
  education TEXT,
  school TEXT,
  religion TEXT,
  religiosity TEXT,
  languages TEXT[],

  -- Optional lifestyle
  exercise TEXT,
  drinking TEXT,
  smoking TEXT,
  diet TEXT,

  -- Relationship goal
  relationship_goal TEXT,
  bio TEXT,

  -- Location data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Profile status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,

  -- Profile completion
  profile_completed BOOLEAN DEFAULT false
);

-- =============================================
-- 2. Photos Table (用戶照片)
-- =============================================
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, photo_order)
);

-- =============================================
-- 3. Likes Table (喜歡記錄)
-- =============================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  like_type TEXT NOT NULL DEFAULT 'normal' CHECK (like_type IN ('normal', 'super')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 一個用戶只能對另一個用戶喜歡一次
  UNIQUE(liker_id, liked_id),

  -- 防止自己喜歡自己
  CHECK (liker_id != liked_id)
);

-- =============================================
-- 4. Matches Table (配對記錄)
-- =============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  -- 確保配對是唯一的（不管順序）
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- =============================================
-- 5. Messages Table (聊天訊息)
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false
);

-- =============================================
-- 6. Passes Table (略過記錄)
-- =============================================
CREATE TABLE IF NOT EXISTS public.passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(passer_id, passed_id),
  CHECK (passer_id != passed_id)
);

-- =============================================
-- Indexes (優化查詢效能)
-- =============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_birthdate ON public.profiles(birthdate);

-- Photos indexes
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON public.likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked_id ON public.likes(liked_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON public.likes(created_at);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_is_active ON public.matches(is_active);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Passes indexes
CREATE INDEX IF NOT EXISTS idx_passes_passer_id ON public.passes(passer_id);
CREATE INDEX IF NOT EXISTS idx_passes_passed_id ON public.passes(passed_id);

-- =============================================
-- Functions & Triggers
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create match when mutual like
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the other person also liked back
  IF EXISTS (
    SELECT 1 FROM public.likes
    WHERE liker_id = NEW.liked_id
    AND liked_id = NEW.liker_id
  ) THEN
    -- Create a match (ensure user1_id < user2_id)
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id)
    )
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_match_on_like
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all active profiles"
  ON public.profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Photos policies
CREATE POLICY "Anyone can view photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own photos"
  ON public.photos FOR ALL
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view likes involving them"
  ON public.likes FOR SELECT
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY "Users can create their own likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = liker_id);

-- Matches policies
CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own matches"
  ON public.matches FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
      AND is_active = true
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Passes policies
CREATE POLICY "Users can view their own passes"
  ON public.passes FOR SELECT
  USING (auth.uid() = passer_id);

CREATE POLICY "Users can create their own passes"
  ON public.passes FOR INSERT
  WITH CHECK (auth.uid() = passer_id);
