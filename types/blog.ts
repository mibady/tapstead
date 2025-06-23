export interface BlogPost {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  featured?: boolean
  content?: string
  tags?: string[]
  relatedPosts?: RelatedPost[]
}

export interface RelatedPost {
  title: string
  category: string
  image: string
}
