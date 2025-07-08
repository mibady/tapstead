import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types';
import { UserData } from './auth-context';

export interface VerificationData {
  license_number?: string;
  insurance_provider?: string;
  coverage_amount?: number;
  background_check_consent: boolean;
  service_areas: string[];
  experience_years: number;
}

export interface VerificationStatus {
  isVerified: boolean;
  missingRequirements: string[];
  verificationDate?: string;
  adminNotes?: string;
}

export async function submitProviderVerification(
  userId: string,
  data: VerificationData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientComponentClient<Database>();

  try {
    // Update profiles table with verification data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        license_number: data.license_number,
        insurance_provider: data.insurance_provider,
        coverage_amount: data.coverage_amount,
        metadata: {
          background_check_consent: data.background_check_consent,
          service_areas: data.service_areas,
          experience_years: data.experience_years,
        },
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Create verification request
    const { error: verificationError } = await supabase
      .from('verification_requests')
      .insert({
        provider_id: userId,
        status: 'pending',
        submitted_data: data,
      });

    if (verificationError) throw verificationError;

    return { success: true };
  } catch (error) {
    console.error('Verification submission error:', error);
    return {
      success: false,
      error: 'Failed to submit verification request. Please try again.',
    };
  }
}

export async function checkVerificationStatus(
  userId: string
): Promise<VerificationStatus> {
  const supabase = createClientComponentClient<Database>();

  try {
    // Get profile and latest verification request
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_verified, metadata')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const { data: verificationRequest, error: verificationError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('provider_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (verificationError && verificationError.code !== 'PGRST116') {
      throw verificationError;
    }

    // Check missing requirements
    const missingRequirements: string[] = [];
    if (!profile?.metadata?.license_number) {
      missingRequirements.push('License number');
    }
    if (!profile?.metadata?.insurance_provider) {
      missingRequirements.push('Insurance information');
    }
    if (!profile?.metadata?.background_check_consent) {
      missingRequirements.push('Background check consent');
    }
    if (!profile?.metadata?.service_areas?.length) {
      missingRequirements.push('Service areas');
    }

    return {
      isVerified: profile?.is_verified || false,
      missingRequirements,
      verificationDate: profile?.metadata?.verification_date,
      adminNotes: verificationRequest?.admin_notes,
    };
  } catch (error) {
    console.error('Verification status check error:', error);
    return {
      isVerified: false,
      missingRequirements: ['Unable to check verification status'],
    };
  }
}

export async function processVerification(
  userId: string,
  approved: boolean,
  notes?: string
) {
  const supabase = createClientComponentClient<Database>();

  try {
    // Update verification request
    const { error: requestError } = await supabase
      .from('verification_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        admin_notes: notes,
        processed_at: new Date().toISOString(),
      })
      .eq('provider_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (requestError) throw requestError;

    // Update profile verification status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_verified: approved,
        metadata: {
          verification_date: new Date().toISOString(),
          verification_notes: notes,
        },
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    console.error('Verification processing error:', error);
    return {
      success: false,
      error: 'Failed to process verification. Please try again.',
    };
  }
}