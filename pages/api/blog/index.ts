import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchPosts, getTotalPostCount } from '@/lib/cms/blog'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { page, category, search, limit } = req.query
    
    const options = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 6,
      category: category as string | undefined,
      search: search as string | undefined,
    }

    const [posts, totalCount] = await Promise.all([
      fetchPosts(options),
      getTotalPostCount(options.category, options.search)
    ])

    const totalPages = Math.ceil(totalCount / options.limit)
    const hasMore = options.page < totalPages

    res.status(200).json({
      posts,
      pagination: {
        page: options.page,
        limit: options.limit,
        totalCount,
        totalPages,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error in blog API:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}