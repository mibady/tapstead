'use client'

import React from 'react'
import { useBlogList } from '@/hooks/useBlog'
import BlogFilters from './BlogFilters'
import PostCard from './PostCard'
import BlogSidebar from './BlogSidebar'

export function BlogListPage() {
  const { posts, loadMore, categories, search, onSearch, onCategory, hasMore, isLoading } = useBlogList()
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Expert insights on home improvement, maintenance, and repair from the Tapstead team.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <BlogSidebar categories={categories} onFilter={onCategory} />
        
        <div className="lg:col-span-3">
          <BlogFilters 
            categories={categories} 
            search={search} 
            onSearch={onSearch} 
            onCategory={onCategory}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          
          {posts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found matching your criteria.</p>
            </div>
          )}
          
          {hasMore && (
            <div className="text-center mt-8">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}