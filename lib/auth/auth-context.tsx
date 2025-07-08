"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase/types'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export type UserRole = 'customer' | 'provider' | 'admin';

export interface UserData {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  customer_type?: 'residential' | 'commercial'
  military_status?: boolean
  role?: UserRole
  is_verified?: boolean
}

interface AuthContextType {
  userRole: UserRole | null
  isVerified: boolean
  isAdmin: boolean
  checkPermission: (requiredRole: UserRole) => boolean
  session: Session | null
  user: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, metadata: Omit<UserData, 'id' | 'email'>) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      }
      setLoading(false);
    };

    getSessionAndUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

    const signUp = async (email: string, password: string, metadata: Omit<UserData, 'id' | 'email'>) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  userRole: user?.role || null,
  isVerified: user?.is_verified || false,
  isAdmin: user?.role === 'admin',
  checkPermission: (requiredRole: UserRole) => {
    if (!user?.role) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
