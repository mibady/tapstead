'use client'

import React from 'react'
import { CategoryCount } from '@/types/blog'
import { Mail, Phone } from 'lucide-react'

interface Props { 
  categories: CategoryCount[]
  onFilter?: (cat: string) => void 
}

export default function BlogSidebar({ categories, onFilter }: Props) {
  const popularPosts = [
    { title: "Essential Spring Home Maintenance Checklist", slug: "spring-home-maintenance" },
    { title: "5 Creative Kitchen Renovation Ideas", slug: "kitchen-renovation-ideas" },
    { title: "Energy-Efficient Home Upgrades", slug: "energy-efficient-upgrades" },
  ]

  return (
    <aside className="space-y-8">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => onFilter?.(category.name)}
                className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Popular Posts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
        <div className="space-y-3">
          {popularPosts.map(post => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block text-sm hover:text-blue-600 transition-colors"
            >
              {post.title}
            </a>
          ))}
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get the latest home improvement tips and industry insights.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
      
      {/* CTA */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need Professional Help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Our experts are ready to help with your home improvement projects.
        </p>
        <div className="space-y-2">
          <a
            href="/contact"
            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
          >
            <Mail size={16} />
            <span className="text-sm">Get a Quote</span>
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
          >
            <Phone size={16} />
            <span className="text-sm">Call Now</span>
          </a>
        </div>
      </div>
    </aside>
  )
}