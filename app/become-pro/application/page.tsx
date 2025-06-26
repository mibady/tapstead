import { lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"

const ProApplicationForm = lazy(() => import("@/components/provider/pro-application-form").then(module => ({ default: module.ProApplicationForm })))

function ApplicationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Application Form...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-32 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-24 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <Suspense fallback={<ApplicationLoading />}>
          <ProApplicationForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
