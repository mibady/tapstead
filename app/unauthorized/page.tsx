import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
// Header is now included in ClientLayoutWrapper
import { Footer } from "@/components/layout/footer"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              This area requires specific permissions that your account doesn&apos;t have.
              If you believe this is an error, please contact support.
            </p>
            
            <div className="flex flex-col space-y-2">
              <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
