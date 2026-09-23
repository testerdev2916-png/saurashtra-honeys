-- Create achievements_gallery table
CREATE TABLE IF NOT EXISTS achievements_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS
ALTER TABLE achievements_gallery ENABLE ROW LEVEL SECURITY;

-- Public can read active achievements
CREATE POLICY "Public can view active achievements"
ON achievements_gallery FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage achievements"
ON achievements_gallery FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Trigger for updated_at (assuming moddatetime is available, if not, standard function)
-- Let's just create a simple function in case moddatetime is missing, or rely on client side.
-- Actually, let's create a custom trigger function just in case.
CREATE OR REPLACE FUNCTION set_achievements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER achievements_gallery_updated_at
BEFORE UPDATE ON achievements_gallery
FOR EACH ROW
EXECUTE FUNCTION set_achievements_updated_at();
