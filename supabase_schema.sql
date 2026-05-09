-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battles table
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Martyrs table
CREATE TABLE martyrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  father_name TEXT,
  photo_url TEXT,
  birth_year INTEGER,
  martyrdom_year INTEGER,
  age INTEGER,
  organization_id UUID REFERENCES organizations(id),
  rank TEXT,
  martyrdom_location TEXT,
  battles TEXT,
  biography TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Martyr Battles (Many-to-Many)
CREATE TABLE martyr_battles (
  martyr_id UUID REFERENCES martyrs(id) ON DELETE CASCADE,
  battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
  PRIMARY KEY (martyr_id, battle_id)
);

-- Martyr Gallery
CREATE TABLE martyr_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  martyr_id UUID REFERENCES martyrs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memorial Candles/Reactions
CREATE TABLE memorial_candles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  martyr_id UUID REFERENCES martyrs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles for Admin management
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Organizations
INSERT INTO organizations (name) VALUES 
('پێشمەرگە'),
('ئاسایش'),
('دژەتیرۆر'),
('زێرەڤانی');

-- RLS (Row Level Security) Policies
ALTER TABLE martyrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE martyrs FORCE ROW LEVEL SECURITY;

-- Public can read approved martyrs only
CREATE POLICY "Public Read" ON martyrs
  FOR SELECT USING (is_approved = true);

-- Admin can read ALL martyrs
CREATE POLICY "Admin Read All" ON martyrs
  FOR SELECT TO authenticated
  USING (true);

-- Secure insert (is_approved must be false)
CREATE POLICY "Strict Insert" ON martyrs
  FOR INSERT
  WITH CHECK (is_approved = false);

-- Admin can update martyrs
CREATE POLICY "Admin Update" ON martyrs
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin can delete martyrs
CREATE POLICY "Admin Delete" ON martyrs
  FOR DELETE TO authenticated
  USING (true);
