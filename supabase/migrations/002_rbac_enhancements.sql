-- RBAC Enhancement Migration
-- Adds role-based access control features and user management improvements

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'consultant', 'admin'));
  END IF;
END $$;

-- Add additional user management columns
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Create user profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  company_name text,
  phone_number text,
  timezone text DEFAULT 'UTC',
  notification_preferences jsonb DEFAULT '{"email": true, "sms": false, "marketing": true}',
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_resource text,
  resource_id uuid,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create consultant applications table for tracking applications
CREATE TABLE IF NOT EXISTS consultant_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  bio text NOT NULL,
  specializations text[] NOT NULL,
  years_experience integer NOT NULL CHECK (years_experience >= 0),
  hourly_rate decimal(10,2) NOT NULL CHECK (hourly_rate > 0),
  portfolio_data jsonb DEFAULT '{}',
  resume_url text,
  linkedin_url text,
  github_url text,
  timezone text,
  availability_hours jsonb DEFAULT '{}',
  
  -- Application status tracking
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_target_user_id ON admin_activity_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultant_applications_status ON consultant_applications(status);
CREATE INDEX IF NOT EXISTS idx_consultant_applications_user_id ON consultant_applications(user_id);

-- Enhanced RLS Policies

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_applications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin activity log policies
CREATE POLICY "Admins can view activity logs" ON admin_activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert activity logs" ON admin_activity_log
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin') AND
    auth.uid() = admin_id
  );

-- Consultant applications policies
CREATE POLICY "Users can view their own application" ON consultant_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own application" ON consultant_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending application" ON consultant_applications
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status = 'pending'
  );

CREATE POLICY "Admins can manage all applications" ON consultant_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Update existing policies for enhanced role-based access

-- Enhanced consultant profiles policies
DROP POLICY IF EXISTS "Admins can manage all consultant profiles" ON consultant_profiles;
CREATE POLICY "Admins can manage all consultant profiles" ON consultant_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Enhanced assessment reports policies
DROP POLICY IF EXISTS "Users can create their own reports" ON assessment_reports;
CREATE POLICY "Authenticated users can create reports" ON assessment_reports
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins can view all reports" ON assessment_reports
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Enhanced consultant bookings policies
CREATE POLICY "Admins can view all bookings" ON consultant_bookings
  FOR SELECT USING (
    auth.uid() = client_id OR
    auth.uid() = (SELECT user_id FROM consultant_profiles WHERE id = consultant_id) OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Functions for RBAC management

-- Function to create user profile automatically when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users;
CREATE TRIGGER trigger_create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity(
  action_type text,
  target_user_id_param uuid DEFAULT NULL,
  target_resource_param text DEFAULT NULL,
  resource_id_param uuid DEFAULT NULL,
  details_param jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO admin_activity_log (
    admin_id, action, target_user_id, target_resource, resource_id, details
  ) VALUES (
    auth.uid(), action_type, target_user_id_param, target_resource_param, resource_id_param, details_param
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve consultant application
CREATE OR REPLACE FUNCTION approve_consultant_application(application_id uuid)
RETURNS boolean AS $$
DECLARE
  app_record consultant_applications%ROWTYPE;
  consultant_id uuid;
BEGIN
  -- Verify admin role
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve consultant applications';
  END IF;
  
  -- Get application details
  SELECT * INTO app_record FROM consultant_applications WHERE id = application_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;
  
  IF app_record.status != 'pending' THEN
    RAISE EXCEPTION 'Application is not in pending status';
  END IF;
  
  -- Update user role to consultant
  UPDATE auth.users SET role = 'consultant' WHERE id = app_record.user_id;
  
  -- Create consultant profile
  INSERT INTO consultant_profiles (
    user_id, email, full_name, bio, specializations, 
    hourly_rate, approval_status, portfolio_data, 
    years_experience, timezone
  ) VALUES (
    app_record.user_id, app_record.email, app_record.full_name, 
    app_record.bio, app_record.specializations, app_record.hourly_rate,
    'approved', app_record.portfolio_data, app_record.years_experience,
    app_record.timezone
  ) RETURNING id INTO consultant_id;
  
  -- Update application status
  UPDATE consultant_applications 
  SET 
    status = 'approved',
    reviewed_by = auth.uid(),
    reviewed_at = now()
  WHERE id = application_id;
  
  -- Log admin activity
  PERFORM log_admin_activity(
    'consultant_approved',
    app_record.user_id,
    'consultant_application',
    application_id,
    jsonb_build_object('consultant_profile_id', consultant_id)
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject consultant application
CREATE OR REPLACE FUNCTION reject_consultant_application(
  application_id uuid,
  rejection_reason text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  app_record consultant_applications%ROWTYPE;
BEGIN
  -- Verify admin role
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject consultant applications';
  END IF;
  
  -- Get application details
  SELECT * INTO app_record FROM consultant_applications WHERE id = application_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;
  
  -- Update application status
  UPDATE consultant_applications 
  SET 
    status = 'rejected',
    admin_notes = rejection_reason,
    reviewed_by = auth.uid(),
    reviewed_at = now()
  WHERE id = application_id;
  
  -- Log admin activity
  PERFORM log_admin_activity(
    'consultant_rejected',
    app_record.user_id,
    'consultant_application',
    application_id,
    jsonb_build_object('reason', rejection_reason)
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond auth.users';
COMMENT ON TABLE admin_activity_log IS 'Audit log of admin actions for compliance and monitoring';
COMMENT ON TABLE consultant_applications IS 'Consultant application submissions and approval workflow';

COMMENT ON FUNCTION approve_consultant_application(uuid) IS 'Approves consultant application and creates consultant profile';
COMMENT ON FUNCTION reject_consultant_application(uuid, text) IS 'Rejects consultant application with optional reason';
COMMENT ON FUNCTION log_admin_activity(text, uuid, text, uuid, jsonb) IS 'Logs admin activities for audit trail';

-- Create indexes for the auth.users role column for performance
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON auth.users(role) WHERE role IS NOT NULL;