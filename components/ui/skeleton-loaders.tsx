"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Skeleton loader for booking cards in the dashboard
 */
export function BookingCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex justify-between mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton loader for quote request cards in the dashboard
 */
export function QuoteRequestCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex justify-between mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton loader for the dashboard page
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <BookingCardSkeleton key={`booking-skeleton-${i}`} />
        ))}
      </div>
      
      <div className="space-y-2 mt-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <QuoteRequestCardSkeleton key={`quote-skeleton-${i}`} />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton loader for the booking confirmation page
 */
export function BookingConfirmationSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * Skeleton loader for the quote request confirmation page
 */
/**
 * Skeleton loader for the quote request form
 */
export function QuoteRequestFormSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>

              <div>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Location & Timing Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Quote Info Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>

              <Skeleton className="h-px w-full my-4" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <Skeleton className="h-24 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}

/**
 * Skeleton loader for the quote request confirmation page
 */
export function QuoteRequestConfirmationSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-5 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto" />
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={`detail-${i}`} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5 mt-1" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={`step-${i}`} className="flex items-start space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
