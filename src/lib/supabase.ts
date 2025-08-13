import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase client (with RLS)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'protoready-web'
        }
      }
    })
  : null

// Server-side Supabase client (bypasses RLS)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    })
  : null

// Rate limiting helper
export async function checkRateLimit(
  identifier: string,
  action: string,
  limit: number = 100,
  windowMinutes: number = 60
): Promise<boolean> {
  if (!supabaseAdmin) return true // Allow if no database
  
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      identifier_val: identifier,
      action_val: action,
      limit_val: limit,
      window_minutes: windowMinutes
    })
    
    if (error) {
      console.error('Rate limit check error:', error)
      return true // Allow on error
    }
    
    return data || false
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return true // Allow on error
  }
}

// User subscription helper
export async function getUserSubscription(userId: string) {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase.rpc('get_user_subscription', {
      user_uuid: userId
    })
    
    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error('Get user subscription error:', error)
    return null
  }
}

// Feature access helper
export async function canUserAccessFeature(userId: string, feature: string): Promise<boolean> {
  if (!supabase) return true // Allow if no database
  
  try {
    const { data, error } = await supabase.rpc('can_user_access_feature', {
      user_uuid: userId,
      feature_name: feature
    })
    
    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Feature access check error:', error)
    return false
  }
}

// Types for our enhanced schema
export interface ConsultantProfile {
  id: string
  user_id: string
  specializations: string[]
  hourly_rate: number
  approval_status: 'pending' | 'approved' | 'rejected'
  portfolio_data: Record<string, unknown>
  created_at: string
}

export interface AssessmentReport {
  id: string
  user_id: string
  report_data: {
    overallScore: number
    securityRating: 'critical' | 'high' | 'medium' | 'low'
    scalabilityIndex: number
    maintainabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F'
    deploymentReadiness: 'ready' | 'needs-work' | 'not-ready'
    detailedFindings: Record<string, unknown>[]
    remediationRoadmap: Record<string, unknown>[]
  }
  report_type: 'free' | 'basic' | 'professional'
  created_at: string
}

export interface ConsultantBooking {
  id: string
  client_id: string
  consultant_id: string
  project_description: string
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  hourly_rate: number
  estimated_hours: number
  created_at: string
}