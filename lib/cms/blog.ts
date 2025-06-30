import { supabase } from '@/lib/supabase/client'
import { BlogPost, CategoryCount } from '@/types/blog'
import { blogPosts, featuredPost } from '@/lib/blog-data' // Fallback to existing data

export interface BlogListOptions {
  page?: number
  limit?: number
  category?: string
  search?: string
}

function transformSupabasePost(post: any): BlogPost {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    readTime: post.read_time,
    category: post.category,
    image: post.image,
    featured: post.featured,
    tags: post.tags || []
  }
}

export async function fetchPosts(options: BlogListOptions = {}): Promise<BlogPost[]> {
  const { page = 1, limit = 6, category, search } = options
  
  // If Supabase is not available, use static data immediately
  if (!supabase) {
    const allPosts = [featuredPost, ...blogPosts]
    let filteredPosts = [...allPosts]
    
    // Apply category filter
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)
    
    return paginatedPosts
  }
  
  try {
    // Try Supabase first
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.warn('Supabase error, falling back to static data:', error.message)
      // Fallback to existing blog data with filtering
      const allPosts = [featuredPost, ...blogPosts]
      let filteredPosts = [...allPosts]
      
      // Apply category filter
      if (category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category?.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
      
      // Apply pagination
      const offset = (page - 1) * limit
      const paginatedPosts = filteredPosts.slice(offset, offset + limit)
      
      return paginatedPosts
    }
    
    // Transform Supabase data to BlogPost format
    return data?.map(transformSupabasePost) || []
    
  } catch (error) {
    console.error('Error in fetchPosts:', error)
    // Final fallback to static data
    const allPosts = [featuredPost, ...blogPosts]
    const offset = (page - 1) * limit
    return allPosts.slice(offset, offset + limit)
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  // If Supabase is not available, use static data immediately
  if (!supabase) {
    const allPosts = [featuredPost, ...blogPosts]
    const post = allPosts.find(p => p.slug === slug)
    return post || null
  }
  
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        related_posts:blog_post_relations!post_id(
          related_post:blog_posts!related_post_id(
            title,
            slug,
            excerpt,
            category,
            image
          )
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) {
      console.warn('Supabase error, falling back to static data:', error.message)
      // Fallback to existing blog data
      const allPosts = [featuredPost, ...blogPosts]
      const post = allPosts.find(p => p.slug === slug)
      return post || null
    }
    
    // Transform Supabase data with related posts
    const transformedPost = transformSupabasePost(data)
    
    // Add related posts if they exist
    if (data.related_posts && data.related_posts.length > 0) {
      transformedPost.relatedPosts = data.related_posts.map((rel: any) => ({
        title: rel.related_post.title,
        slug: rel.related_post.slug,
        excerpt: rel.related_post.excerpt,
        category: rel.related_post.category,
        image: rel.related_post.image
      }))
    }
    
    return transformedPost
    
  } catch (error) {
    console.error('Error in fetchPostBySlug:', error)
    // Final fallback to static data
    const allPosts = [featuredPost, ...blogPosts]
    const post = allPosts.find(p => p.slug === slug)
    return post || null
  }
}

export async function fetchCategories(): Promise<CategoryCount[]> {
  // If Supabase is not available, use static data immediately
  if (!supabase) {
    const allPosts = [featuredPost, ...blogPosts]
    const categories = new Map<string, number>()
    
    allPosts.forEach(post => {
      if (post.category) {
        categories.set(post.category, (categories.get(post.category) || 0) + 1)
      }
    })
    
    return Array.from(categories.entries()).map(([name, count]) => ({
      name,
      count
    }))
  }
  
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true)
    
    if (error) {
      console.warn('Supabase error, falling back to static data:', error.message)
      // Fallback to existing blog data
      const allPosts = [featuredPost, ...blogPosts]
      const categories = new Map<string, number>()
      
      allPosts.forEach(post => {
        if (post.category) {
          categories.set(post.category, (categories.get(post.category) || 0) + 1)
        }
      })
      
      return Array.from(categories.entries()).map(([name, count]) => ({
        name,
        count
      }))
    }
    
    // Process Supabase data
    const categories = new Map<string, number>()
    data.forEach(post => {
      if (post.category) {
        categories.set(post.category, (categories.get(post.category) || 0) + 1)
      }
    })
    
    return Array.from(categories.entries()).map(([name, count]) => ({
      name,
      count
    }))
    
  } catch (error) {
    console.error('Error in fetchCategories:', error)
    // Final fallback to static data
    const allPosts = [featuredPost, ...blogPosts]
    const categories = new Map<string, number>()
    
    allPosts.forEach(post => {
      if (post.category) {
        categories.set(post.category, (categories.get(post.category) || 0) + 1)
      }
    })
    
    return Array.from(categories.entries()).map(([name, count]) => ({
      name,
      count
    }))
  }
}

export async function getTotalPostCount(category?: string, search?: string): Promise<number> {
  // If Supabase is not available, use static data immediately
  if (!supabase) {
    const allPosts = [featuredPost, ...blogPosts]
    let filteredPosts = [...allPosts]
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.toLowerCase() === category.toLowerCase()
      )
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      )
    }
    
    return filteredPosts.length
  }
  
  try {
    // Try Supabase first
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }
    
    const { count, error } = await query
    
    if (error) {
      console.warn('Supabase error, falling back to static data:', error.message)
      // Fallback to existing blog data
      const allPosts = [featuredPost, ...blogPosts]
      let filteredPosts = [...allPosts]
      
      if (category) {
        filteredPosts = filteredPosts.filter(post => 
          post.category?.toLowerCase() === category.toLowerCase()
        )
      }
      
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower)
        )
      }
      
      return filteredPosts.length
    }
    
    return count || 0
    
  } catch (error) {
    console.error('Error in getTotalPostCount:', error)
    // Final fallback to static data
    const allPosts = [featuredPost, ...blogPosts]
    return allPosts.length
  }
}