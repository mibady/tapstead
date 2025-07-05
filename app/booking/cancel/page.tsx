import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BookingCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Cancelled</h1>
        <p className="mb-6">Your booking was not completed. You have not been charged.</p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/booking">
            <Button variant="default">Try Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
