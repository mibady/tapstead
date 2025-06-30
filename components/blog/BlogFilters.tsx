'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { CategoryCount } from '@/types/blog'

interface Props { 
  search: string
  onSearch: (q: string) => void
  categories: CategoryCount[]
  onCategory: (cat: string) => void
}

export default function BlogFilters({ search, onSearch, categories, onCategory }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategory('')}
            className="px-4 py-2 text-sm border rounded-full hover:bg-gray-50 transition-colors"
          >
            All Categories
          </button>
          {categories.slice(0, 4).map(category => (
            <button
              key={category.name}
              onClick={() => onCategory(category.name)}
              className="px-4 py-2 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}