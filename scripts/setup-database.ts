import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🛠️  Setting up blog database tables...')

  try {
    // Read the SQL migration file
    const sqlPath = join(__dirname, '../supabase/migrations/001_create_blog_posts.sql')
    const sql = readFileSync(sqlPath, 'utf8')

    console.log('📄 Executing SQL migration...')

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // If the RPC doesn't exist, try direct query approach
      console.log('🔄 Trying alternative approach...')
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)

      for (const statement of statements) {
        if (statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX') || 
            statement.includes('CREATE POLICY') || statement.includes('ALTER TABLE') ||
            statement.includes('CREATE FUNCTION') || statement.includes('CREATE TRIGGER')) {
          
          console.log(`   Executing: ${statement.split('\n')[0]}...`)
          
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement })
          
          if (stmtError) {
            console.warn(`   ⚠️  Warning: ${stmtError.message}`)
          }
        }
      }
    } else {
      console.log('✅ SQL migration executed successfully!')
    }

    // Verify tables were created
    console.log('🔍 Verifying table creation...')
    
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['blog_posts', 'blog_post_relations'])

    if (tableError) {
      console.error('❌ Error checking tables:', tableError)
    } else {
      const tableNames = tables?.map(t => t.table_name) || []
      console.log('📋 Tables found:', tableNames)
      
      if (tableNames.includes('blog_posts')) {
        console.log('✅ blog_posts table created successfully!')
      } else {
        console.log('⚠️  blog_posts table not found')
      }
      
      if (tableNames.includes('blog_post_relations')) {
        console.log('✅ blog_post_relations table created successfully!')
      } else {
        console.log('⚠️  blog_post_relations table not found')
      }
    }

    console.log('🎉 Database setup completed!')

  } catch (error) {
    console.error('💥 Database setup failed:', error)
    throw error
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✨ Database setup script completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Database setup script failed:', error)
      process.exit(1)
    })
}

export { setupDatabase }