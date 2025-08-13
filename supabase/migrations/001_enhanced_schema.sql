-- Enhanced ProtoReady.ai Schema Migration
-- Adds consultant marketplace and assessment storage capabilities

-- Create enum types for better data integrity
CREATE TYPE consultant_approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE report_type AS ENUM ('free', 'basic', 'professional');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE security_rating AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE deployment_readiness AS ENUM ('ready', 'needs_work', 'not_ready');
CREATE TYPE tool_type AS ENUM ('lovable', 'replit', 'bolt', 'cursor', 'github', 'other');

-- Consultant profiles table
CREATE TABLE consultant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  bio text,
  specializations text[] NOT NULL DEFAULT '{}',
  hourly_rate decimal(10,2) NOT NULL CHECK (hourly_rate > 0),
  approval_status consultant_approval_status DEFAULT 'pending',
  portfolio_data jsonb DEFAULT '{}',
  years_experience integer CHECK (years_experience >= 0),
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  total_projects integer DEFAULT 0,
  availability_status text DEFAULT 'available',
  timezone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Assessment reports table
CREATE TABLE assessment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  tool_type tool_type NOT NULL,
  report_type report_type NOT NULL,
  
  -- Core assessment data
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  security_rating security_rating,
  scalability_index integer CHECK (scalability_index >= 1 AND scalability_index <= 5),
  maintainability_grade text CHECK (maintainability_grade IN ('A', 'B', 'C', 'D', 'F')),
  deployment_readiness deployment_readiness,
  
  -- Detailed analysis (JSON for flexibility)
  detailed_findings jsonb DEFAULT '[]',
  remediation_roadmap jsonb DEFAULT '[]',
  raw_assessment_data jsonb DEFAULT '{}',
  
  -- Cost estimates
  estimated_cost_min decimal(10,2),
  estimated_cost_max decimal(10,2),
  
  -- Metadata
  assessment_duration_ms integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultant bookings table
CREATE TABLE consultant_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  assessment_report_id uuid REFERENCES assessment_reports(id) ON DELETE SET NULL,
  
  project_title text NOT NULL,
  project_description text NOT NULL,
  requirements text,
  
  hourly_rate decimal(10,2) NOT NULL,
  estimated_hours integer,
  actual_hours decimal(5,2) DEFAULT 0,
  
  status booking_status DEFAULT 'pending',
  
  -- Communication
  client_notes text,
  consultant_notes text,
  
  -- Scheduling
  start_date timestamptz,
  end_date timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultant reviews table
CREATE TABLE consultant_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES consultant_bookings(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  
  -- Review categories
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  technical_rating integer CHECK (technical_rating >= 1 AND technical_rating <= 5),
  timeliness_rating integer CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(booking_id)
);

-- User subscription tracking
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier text NOT NULL CHECK (subscription_tier IN ('free', 'basic', 'professional')),
  stripe_customer_id text,
  stripe_subscription_id text,
  
  -- Usage tracking
  assessments_used_this_month integer DEFAULT 0,
  assessments_limit integer DEFAULT 3, -- free tier limit
  
  -- Subscription status
  is_active boolean DEFAULT true,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_consultant_profiles_approval_status ON consultant_profiles(approval_status);
CREATE INDEX idx_consultant_profiles_specializations ON consultant_profiles USING gin(specializations);
CREATE INDEX idx_consultant_profiles_rating ON consultant_profiles(rating DESC);

CREATE INDEX idx_assessment_reports_user_id ON assessment_reports(user_id);
CREATE INDEX idx_assessment_reports_created_at ON assessment_reports(created_at DESC);
CREATE INDEX idx_assessment_reports_tool_type ON assessment_reports(tool_type);
CREATE INDEX idx_assessment_reports_report_type ON assessment_reports(report_type);

CREATE INDEX idx_consultant_bookings_client_id ON consultant_bookings(client_id);
CREATE INDEX idx_consultant_bookings_consultant_id ON consultant_bookings(consultant_id);
CREATE INDEX idx_consultant_bookings_status ON consultant_bookings(status);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE consultant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Consultant profiles policies
CREATE POLICY "Users can view approved consultant profiles" ON consultant_profiles
  FOR SELECT USING (approval_status = 'approved');

CREATE POLICY "Consultants can view and update their own profile" ON consultant_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all consultant profiles" ON consultant_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Assessment reports policies
CREATE POLICY "Users can view their own reports" ON assessment_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" ON assessment_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON assessment_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Consultant bookings policies
CREATE POLICY "Clients can view their own bookings" ON consultant_bookings
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Consultants can view bookings where they are the consultant" ON consultant_bookings
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM consultant_profiles WHERE id = consultant_id));

CREATE POLICY "Clients can create bookings" ON consultant_bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients and consultants can update relevant bookings" ON consultant_bookings
  FOR UPDATE USING (
    auth.uid() = client_id OR 
    auth.uid() = (SELECT user_id FROM consultant_profiles WHERE id = consultant_id)
  );

-- Consultant reviews policies
CREATE POLICY "Anyone can view reviews" ON consultant_reviews
  FOR SELECT TO authenticated;

CREATE POLICY "Clients can create reviews for their completed bookings" ON consultant_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND 
    EXISTS (
      SELECT 1 FROM consultant_bookings 
      WHERE id = booking_id AND status = 'completed' AND client_id = auth.uid()
    )
  );

-- User subscriptions policies
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Functions for maintaining data integrity

-- Function to update consultant rating when new review is added
CREATE OR REPLACE FUNCTION update_consultant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE consultant_profiles 
  SET 
    rating = (
      SELECT AVG(rating) 
      FROM consultant_reviews 
      WHERE consultant_id = NEW.consultant_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM consultant_reviews 
      WHERE consultant_id = NEW.consultant_id
    ),
    updated_at = now()
  WHERE id = NEW.consultant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update consultant rating
CREATE TRIGGER trigger_update_consultant_rating
  AFTER INSERT ON consultant_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_consultant_rating();

-- Function to update project count when booking is completed
CREATE OR REPLACE FUNCTION update_consultant_project_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE consultant_profiles 
    SET 
      total_projects = total_projects + 1,
      updated_at = now()
    WHERE id = NEW.consultant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update project count
CREATE TRIGGER trigger_update_consultant_project_count
  AFTER UPDATE ON consultant_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_consultant_project_count();

-- Function to reset monthly assessment usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions 
  SET assessments_used_this_month = 0
  WHERE current_period_start <= now() - interval '1 month';
END;
$$ LANGUAGE plpgsql;

-- Insert default subscription for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, subscription_tier)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user subscription
CREATE TRIGGER trigger_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Seed data for development
INSERT INTO consultant_profiles (
  user_id, email, full_name, bio, specializations, hourly_rate, 
  approval_status, years_experience, rating, total_reviews
) VALUES
  (
    gen_random_uuid(),
    'john.security@example.com',
    'John Smith',
    'Security specialist with 8+ years experience in enterprise security audits and SOC 2 compliance.',
    ARRAY['Security & Compliance', 'DevOps & Infrastructure'],
    120.00,
    'approved',
    8,
    4.8,
    15
  ),
  (
    gen_random_uuid(),
    'sarah.fullstack@example.com',
    'Sarah Johnson',
    'Full-stack developer specializing in React, Node.js, and cloud deployments.',
    ARRAY['Performance Optimization', 'API Architecture'],
    95.00,
    'approved',
    6,
    4.9,
    23
  ),
  (
    gen_random_uuid(),
    'mike.devops@example.com',
    'Mike Chen',
    'DevOps engineer with expertise in Kubernetes, CI/CD, and infrastructure automation.',
    ARRAY['DevOps & Infrastructure', 'Performance Optimization'],
    110.00,
    'approved',
    7,
    4.7,
    18
  );

COMMENT ON TABLE consultant_profiles IS 'Vetted consultant profiles with specializations and ratings';
COMMENT ON TABLE assessment_reports IS 'AI-generated production readiness assessment reports';
COMMENT ON TABLE consultant_bookings IS 'Client-consultant project bookings and coordination';
COMMENT ON TABLE consultant_reviews IS 'Client reviews and ratings for completed consultant projects';
COMMENT ON TABLE user_subscriptions IS 'User subscription tiers and usage tracking';