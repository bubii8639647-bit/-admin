-- 1. Songs Table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Single',
  genre TEXT DEFAULT 'Pop',
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INT DEFAULT 180,
  play_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Playlist Songs Junction
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (playlist_id, song_id)
);

-- 4. Liked Songs Table
CREATE TABLE IF NOT EXISTS liked_songs (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, song_id)
);

-- 5. RPC Function to increment play count safely
CREATE OR REPLACE FUNCTION increment_play_count(song_row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE songs SET play_count = play_count + 1 WHERE id = song_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;

-- Public read access for songs
CREATE POLICY "Public songs are viewable by everyone" ON songs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert songs" ON songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User policies for playlists & likes
CREATE POLICY "Users manage own playlists" ON playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own playlist songs" ON playlist_songs FOR ALL USING (
  EXISTS (SELECT 1 FROM playlists WHERE id = playlist_songs.playlist_id AND user_id = auth.uid())
);
CREATE POLICY "Users manage own liked songs" ON liked_songs FOR ALL USING (auth.uid() = user_id);
