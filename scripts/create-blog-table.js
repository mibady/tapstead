const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env file
const envPath = path.join(__dirname, '../.env')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key] = value.replace(/^["']|["']$/g, '')
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBlogTable() {
  console.log('🛠️  Creating blog_posts table...')

  try {
    // Create the main blog_posts table
    const createTableSQL = `
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
    `

    const { error: tableError } = await supabase.rpc('exec', { sql: createTableSQL })
    
    if (tableError && !tableError.message.includes('already exists')) {
      console.error('❌ Error creating table:', tableError)
      throw tableError
    }

    console.log('✅ blog_posts table created successfully!')

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;'
    ]

    for (const indexSQL of indexes) {
      const { error: indexError } = await supabase.rpc('exec', { sql: indexSQL })
      if (indexError && !indexError.message.includes('already exists')) {
        console.warn('⚠️  Index warning:', indexError.message)
      }
    }

    console.log('✅ Indexes created successfully!')

    // Create related posts table
    const relatedTableSQL = `
      CREATE TABLE IF NOT EXISTS blog_post_relations (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        related_post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        created_at timestamp with time zone DEFAULT now(),
        UNIQUE(post_id, related_post_id)
      );
    `

    const { error: relatedError } = await supabase.rpc('exec', { sql: relatedTableSQL })
    
    if (relatedError && !relatedError.message.includes('already exists')) {
      console.error('❌ Error creating relations table:', relatedError)
      throw relatedError
    }

    console.log('✅ blog_post_relations table created successfully!')

    // Enable RLS
    const rlsSQL = `
      ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE blog_post_relations ENABLE ROW LEVEL SECURITY;
    `

    await supabase.rpc('exec', { sql: rlsSQL })

    // Create policies
    const policySQL = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'blog_posts' 
          AND policyname = 'Public can read published blog posts'
        ) THEN
          CREATE POLICY "Public can read published blog posts" ON blog_posts
            FOR SELECT USING (published = true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'blog_post_relations' 
          AND policyname = 'Public can read relations of published posts'
        ) THEN
          CREATE POLICY "Public can read relations of published posts" ON blog_post_relations
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM blog_posts 
                WHERE id = blog_post_relations.post_id 
                AND published = true
              )
            );
        END IF;
      END
      $$;
    `

    await supabase.rpc('exec', { sql: policySQL })

    console.log('✅ RLS policies created successfully!')

    // Verify the table exists
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Error verifying table:', error)
    } else {
      console.log('✅ Table verification successful!')
    }

    console.log('🎉 Blog database setup completed!')

  } catch (error) {
    console.error('💥 Database setup failed:', error)
    throw error
  }
}

// Run the function
createBlogTable()
  .then(() => {
    console.log('✨ Database setup completed successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  })