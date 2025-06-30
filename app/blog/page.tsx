import { MarketingLayout } from "@/components/layout/marketing-layout"
import { BlogListPage } from "@/components/blog/BlogList"

export const metadata = {
  title: "Blog - Home Service Tips & Insights | Tapstead",
  description:
    "Expert tips, guides, and insights about home maintenance, repairs, and services from the Tapstead team.",
}

export default function Blog() {
  return (
    <MarketingLayout>
      <BlogListPage />
    </MarketingLayout>
  )
}
