import React from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import { Calendar, User, Clock } from 'lucide-react'

interface Props {
  post: BlogPost
}

export default function PostCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Featured Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">
            {post.category || 'Blog Post'}
          </span>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}
          </div>
          
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime}m</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}