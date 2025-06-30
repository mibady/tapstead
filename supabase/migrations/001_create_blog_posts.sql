-- Create blog_posts table for CMS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text,
  author text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  read_time text,
  category text,
  image text,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Create index on date for ordering
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);

-- Create index on featured posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Create related_posts table for storing relationships
CREATE TABLE IF NOT EXISTS blog_post_relations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  related_post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(post_id, related_post_id)
);

-- Create index for relations
CREATE INDEX IF NOT EXISTS idx_blog_post_relations_post_id ON blog_post_relations(post_id);

-- Enable RLS for relations
ALTER TABLE blog_post_relations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to relations of published posts
CREATE POLICY "Public can read relations of published posts" ON blog_post_relations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE id = blog_post_relations.post_id 
      AND published = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();