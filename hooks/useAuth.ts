import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import type { Database } from '@/lib/supabase/types';

interface AuthState {
  user: User | null;
  profile: Database['public']['Tables']['profiles']['Row'] | null;
  loading: boolean;
  isAdmin: boolean;
  isProvider: boolean;
  isVerifiedProvider: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Database['public']['Tables']['profiles']['Row'] | null) => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isProvider: false,
  isVerifiedProvider: false,
  setUser: (user) => set((state) => ({ 
    user,
    isAdmin: state.profile?.role === 'admin',
    isProvider: state.profile?.role === 'provider',
    isVerifiedProvider: state.profile?.role === 'provider' && state.profile.is_verified
  })),
  setProfile: (profile) => set((state) => ({ 
    profile,
    isAdmin: profile?.role === 'admin',
    isProvider: profile?.role === 'provider',
    isVerifiedProvider: profile?.role === 'provider' && profile.is_verified
  })),
  setLoading: (loading) => set({ loading })
}));

export function useAuth(options: { 
  redirectTo?: string;
  requiredRole?: 'customer' | 'provider' | 'admin';
  requireVerification?: boolean;
} = {}) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { user, profile, loading, setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session?.user) {
          setUser(null);
          setProfile(null);
          if (options.redirectTo) {
            router.push(`/auth/login?redirect=${encodeURIComponent(options.redirectTo)}`);
          }
          return;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        setUser(session.user);
        setProfile(profile);

        // Check role requirements
        if (options.requiredRole && profile.role !== options.requiredRole) {
          router.push('/dashboard');
          return;
        }

        // Check verification requirements
        if (options.requireVerification && (!profile.is_verified)) {
          router.push('/provider/verification');
          return;
        }

      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        getUser();
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        if (options.redirectTo) {
          router.push(`/auth/login?redirect=${encodeURIComponent(options.redirectTo)}`);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [options.redirectTo, options.requiredRole, options.requireVerification]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: useAuthStore((state) => state.isAdmin),
    isProvider: useAuthStore((state) => state.isProvider),
    isVerifiedProvider: useAuthStore((state) => state.isVerifiedProvider)
  };
}