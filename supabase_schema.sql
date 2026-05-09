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
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE martyr_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE martyr_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read approved martyrs
CREATE POLICY "Approved martyrs are viewable by everyone" ON martyrs
  FOR SELECT USING (is_approved = true);

-- Auth users can insert submissions (starts as not approved)
CREATE POLICY "Authenticated users can insert martyrs" ON martyrs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admins can do everything
CREATE POLICY "Admins can manage everything" ON martyrs
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Repeat similar policies for other tables...
