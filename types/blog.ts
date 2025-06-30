export interface BlogPost {
  title: string
  slug: string
  excerpt: string
  author: string
  date: string
  readTime?: string
  category?: string
  image?: string
  featured?: boolean
  content?: string
  tags?: string[]
  relatedPosts?: RelatedPost[]
}

export interface RelatedPost {
  title: string
  slug: string
  excerpt?: string
  category?: string
  image?: string
}

export interface CategoryCount {
  name: string
  count: number
}
