import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchPostBySlug } from '@/lib/cms/blog'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { slug } = req.query
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug parameter' })
    }

    const post = await fetchPostBySlug(slug)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    console.error('Error in blog post API:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}