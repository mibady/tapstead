'use client'

import React from 'react'
import { BlogPost } from '@/types/blog'
import { sanitizeHTML } from '@/lib/utils/html-sanitizer'
import BlogSidebar from './BlogSidebar'
import { Calendar, User, Tag } from 'lucide-react'

interface Props { 
  post: BlogPost
}

export function BlogPostPage({ post }: Props) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              {post.readTime && (
                <span>{post.readTime} min read</span>
              )}
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <Tag size={16} className="text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
          
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: sanitizeHTML(post.content || '') 
            }} />
          </div>
          
          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {post.relatedPosts.map(relatedPost => (
                  <a 
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold mb-2">{relatedPost.title}</h4>
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
        
        <BlogSidebar categories={[]} />
      </div>
    </div>
  )
}