'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost, CategoryCount } from '@/types/blog'
import { fetchPosts, fetchCategories } from '@/lib/cms/blog'

export function useBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories()
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }
    
    loadCategories()
  }, [])

  // Fetch posts when filters change
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const postsData = await fetchPosts({
          page: 1,
          category: selectedCategory || undefined,
          search: search || undefined,
        })
        
        setPosts(postsData)
        setPage(1)
        setHasMore(postsData.length >= 6) // Assuming 6 is the default limit
      } catch (err) {
        setError('Failed to load posts')
        console.error('Error loading posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [search, selectedCategory])

  // Load more posts (pagination)
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = page + 1
      const morePosts = await fetchPosts({
        page: nextPage,
        category: selectedCategory || undefined,
        search: search || undefined,
      })

      if (morePosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...morePosts])
        setPage(nextPage)
        setHasMore(morePosts.length >= 6)
      }
    } catch (err) {
      setError('Failed to load more posts')
      console.error('Error loading more posts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, selectedCategory, search, isLoading, hasMore])

  // Search handler
  const onSearch = useCallback((query: string) => {
    setSearch(query)
    setPage(1)
  }, [])

  // Category filter handler
  const onCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }, [])

  return {
    posts,
    categories,
    search,
    selectedCategory,
    isLoading,
    hasMore,
    error,
    loadMore,
    onSearch,
    onCategory,
  }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Using the API route for consistency
        const response = await fetch(`/api/blog/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Post not found')
          } else {
            setError('Failed to load post')
          }
          return
        }

        const postData = await response.json()
        setPost(postData)
      } catch (err) {
        setError('Failed to load post')
        console.error('Error loading post:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadPost()
    }
  }, [slug])

  return {
    post,
    isLoading,
    error,
  }
}