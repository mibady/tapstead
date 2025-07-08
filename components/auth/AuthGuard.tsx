'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'provider' | 'admin';
  requireVerification?: boolean;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  requireVerification 
}: AuthGuardProps) {
  const pathname = usePathname();
  const { loading } = useAuth({
    redirectTo: pathname,
    requiredRole,
    requireVerification
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}