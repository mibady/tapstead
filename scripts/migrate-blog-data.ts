import { createClient } from '@supabase/supabase-js'
import { blogPosts, featuredPost } from '../lib/blog-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface BlogPostInsert {
  title: string
  slug: string
  excerpt: string
  content?: string
  author: string
  date: string
  read_time?: string
  category?: string
  image?: string
  featured?: boolean
  published: boolean
  tags?: string[]
}

async function migrateBlogData() {
  console.log('🚀 Starting blog data migration to Supabase...')

  try {
    // Prepare all blog posts for insertion
    const allPosts = [featuredPost, ...blogPosts]
    const postsToInsert: BlogPostInsert[] = allPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      read_time: post.readTime,
      category: post.category,
      image: post.image,
      featured: post.featured || false,
      published: true,
      tags: post.tags || []
    }))

    console.log(`📝 Inserting ${postsToInsert.length} blog posts...`)

    // Insert blog posts
    const { data: insertedPosts, error: insertError } = await supabase
      .from('blog_posts')
      .insert(postsToInsert)
      .select('id, slug, title')

    if (insertError) {
      console.error('❌ Error inserting blog posts:', insertError)
      return
    }

    console.log('✅ Blog posts inserted successfully!')
    console.log('📊 Inserted posts:', insertedPosts?.map(p => p.title))

    // Create a mapping of slug to id for relations
    const slugToIdMap = new Map(
      insertedPosts?.map(post => [post.slug, post.id]) || []
    )

    // Now handle related posts
    console.log('🔗 Setting up related post relationships...')
    
    const relations: Array<{ post_id: string; related_post_id: string }> = []
    
    for (const post of allPosts) {
      if (post.relatedPosts && post.relatedPosts.length > 0) {
        const postId = slugToIdMap.get(post.slug)
        if (postId) {
          for (const relatedPost of post.relatedPosts) {
            const relatedPostId = slugToIdMap.get(relatedPost.slug)
            if (relatedPostId && postId !== relatedPostId) {
              relations.push({
                post_id: postId,
                related_post_id: relatedPostId
              })
            }
          }
        }
      }
    }

    if (relations.length > 0) {
      console.log(`📎 Inserting ${relations.length} post relationships...`)
      
      const { error: relationsError } = await supabase
        .from('blog_post_relations')
        .insert(relations)

      if (relationsError) {
        console.error('❌ Error inserting post relations:', relationsError)
      } else {
        console.log('✅ Post relationships created successfully!')
      }
    }

    // Verify the data
    console.log('🔍 Verifying migration...')
    
    const { data: verifyPosts, error: verifyError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category, featured, published')
      .order('date', { ascending: false })

    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError)
      return
    }

    console.log('📋 Migration Summary:')
    console.log(`   • Total posts: ${verifyPosts?.length || 0}`)
    console.log(`   • Featured posts: ${verifyPosts?.filter(p => p.featured).length || 0}`)
    console.log(`   • Categories: ${new Set(verifyPosts?.map(p => p.category).filter(Boolean)).size}`)
    console.log(`   • Relations: ${relations.length}`)

    console.log('🎉 Blog data migration completed successfully!')

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
if (require.main === module) {
  migrateBlogData()
    .then(() => {
      console.log('✨ Migration script completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateBlogData }