import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { UserRole } from './auth-context';

export type AdminCheckResult = {
  isAdmin: boolean;
  userId: string | null;
  userRole: UserRole | null;
};

/**
 * Server-side helper to check if the current user has admin access
 * Redirects to login if not authenticated or to dashboard if not authorized
 */
export async function checkAdminAccess(): Promise<AdminCheckResult> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/auth');
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const userRole = profile?.role as UserRole;
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
      redirect('/dashboard');
    }

    return {
      isAdmin: true,
      userId: session.user.id,
      userRole,
    };
  } catch (error) {
    console.error('Admin access check error:', error);
    redirect('/auth');
  }
}

/**
 * Server-side helper to check if a specific action is allowed
 * Based on user role and verification status
 */
export async function checkActionAuthorization(
  userId: string,
  requiredRole: UserRole,
  requireVerification = false
): Promise<boolean> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_verified')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    // Admin can do everything
    if (profile.role === 'admin') return true;

    // Check role match
    if (profile.role !== requiredRole) return false;

    // Check verification if required
    if (requireVerification && !profile.is_verified) return false;

    return true;
  } catch (error) {
    console.error('Action authorization check error:', error);
    return false;
  }
}

/**
 * Server action to get a list of all admin users
 * Only accessible by admin users
 */
export async function getAdminUsers() {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data: admins, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .eq('role', 'admin');

    if (error) throw error;

    return admins;
  } catch (error) {
    console.error('Get admin users error:', error);
    return [];
  }
}

/**
 * Server action to grant admin access to a user
 * Only executable by existing admins
 */
export async function grantAdminAccess(
  targetUserId: string,
  currentUserId: string
) {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Verify current user is admin
    const isAdmin = await checkActionAuthorization(currentUserId, 'admin');
    if (!isAdmin) {
      throw new Error('Not authorized to grant admin access');
    }

    // Update user role
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', targetUserId);

    if (error) throw error;

    // Log admin access grant
    await supabase.from('admin_audit_log').insert({
      action: 'grant_admin',
      performed_by: currentUserId,
      target_user: targetUserId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Grant admin access error:', error);
    return {
      success: false,
      error: 'Failed to grant admin access',
    };
  }
}

/**
 * Server action to revoke admin access from a user
 * Only executable by existing admins
 */
export async function revokeAdminAccess(
  targetUserId: string,
  currentUserId: string
) {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Verify current user is admin
    const isAdmin = await checkActionAuthorization(currentUserId, 'admin');
    if (!isAdmin) {
      throw new Error('Not authorized to revoke admin access');
    }

    // Prevent self-revocation
    if (targetUserId === currentUserId) {
      throw new Error('Cannot revoke your own admin access');
    }

    // Update user role
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'customer' })
      .eq('id', targetUserId);

    if (error) throw error;

    // Log admin access revocation
    await supabase.from('admin_audit_log').insert({
      action: 'revoke_admin',
      performed_by: currentUserId,
      target_user: targetUserId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Revoke admin access error:', error);
    return {
      success: false,
      error: 'Failed to revoke admin access',
    };
  }
}