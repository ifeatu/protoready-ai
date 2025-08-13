-- Production Security Enhancements for ProtoReady.ai
-- Run this migration in production Supabase instance

-- Enable RLS on all tables if not already enabled
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create auth schema functions for RLS policies
CREATE OR REPLACE FUNCTION auth.user_id() 
RETURNS uuid 
LANGUAGE sql STABLE
AS $$ 
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() 
RETURNS text 
LANGUAGE sql STABLE
AS $$ 
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;

-- Enhanced RLS Policies

-- User Subscriptions: Users can only access their own subscription data
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;

CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.user_id() = user_id::uuid);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.user_id() = user_id::uuid);

CREATE POLICY "Service role can manage all subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Assessment Reports: Users can only access their own reports
DROP POLICY IF EXISTS "Users can view own reports" ON assessment_reports;
DROP POLICY IF EXISTS "Users can create own reports" ON assessment_reports;
DROP POLICY IF EXISTS "Users can update own reports" ON assessment_reports;

CREATE POLICY "Users can view own reports" ON assessment_reports
  FOR SELECT USING (auth.user_id() = user_id::uuid);

CREATE POLICY "Users can create own reports" ON assessment_reports
  FOR INSERT WITH CHECK (auth.user_id() = user_id::uuid);

CREATE POLICY "Users can update own reports" ON assessment_reports
  FOR UPDATE USING (auth.user_id() = user_id::uuid);

-- Consultants: Public read, consultant-only edit
DROP POLICY IF EXISTS "Anyone can view approved consultants" ON consultants;
DROP POLICY IF EXISTS "Consultants can update own profile" ON consultants;
DROP POLICY IF EXISTS "Anyone can apply as consultant" ON consultants;

CREATE POLICY "Anyone can view approved consultants" ON consultants
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Consultants can update own profile" ON consultants
  FOR UPDATE USING (auth.user_id() = user_id::uuid);

CREATE POLICY "Anyone can apply as consultant" ON consultants
  FOR INSERT WITH CHECK (true);

-- Bookings: Users and consultants can access their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Consultants can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Consultants can update their bookings" ON bookings;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.user_id() = client_user_id::uuid);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.user_id() = client_user_id::uuid);

CREATE POLICY "Consultants can view their bookings" ON bookings
  FOR SELECT USING (
    auth.user_id() IN (
      SELECT user_id FROM consultants WHERE id = consultant_id
    )
  );

CREATE POLICY "Consultants can update their bookings" ON bookings
  FOR UPDATE USING (
    auth.user_id() IN (
      SELECT user_id FROM consultants WHERE id = consultant_id
    )
  );

-- Reviews: Public read, verified clients can write
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Verified clients can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;

CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Verified clients can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.user_id() = client_user_id::uuid AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE client_user_id = auth.user_id()::text 
      AND consultant_id = reviews.consultant_id
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.user_id() = client_user_id::uuid);

-- Messages: Only participants can access
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.user_id() = sender_id::uuid OR 
    auth.user_id() = recipient_id::uuid
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.user_id() = sender_id::uuid);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_assessment_reports_user_id ON assessment_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_reports_created_at ON assessment_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultants_status ON consultants(status);
CREATE INDEX IF NOT EXISTS idx_consultants_user_id ON consultants(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_user_id ON bookings(client_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_consultant_id ON bookings(consultant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reviews_consultant_id ON reviews(consultant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid uuid)
RETURNS TABLE (
  subscription_tier text,
  is_active boolean,
  assessments_used_this_month integer,
  current_period_end timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    subscription_tier,
    is_active,
    assessments_used_this_month,
    current_period_end
  FROM user_subscriptions 
  WHERE user_id = user_uuid::text;
$$;

CREATE OR REPLACE FUNCTION increment_assessment_usage(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE user_subscriptions 
  SET assessments_used_this_month = assessments_used_this_month + 1
  WHERE user_id = user_uuid::text
  RETURNING true;
$$;

CREATE OR REPLACE FUNCTION can_user_access_feature(
  user_uuid uuid,
  feature_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier text;
  user_active boolean;
BEGIN
  SELECT subscription_tier, is_active 
  INTO user_tier, user_active
  FROM user_subscriptions 
  WHERE user_id = user_uuid::text;
  
  -- Default to free tier if no subscription found
  IF user_tier IS NULL THEN
    user_tier := 'free';
    user_active := true;
  END IF;
  
  -- Check if user is active
  IF NOT user_active THEN
    RETURN false;
  END IF;
  
  -- Feature access logic
  CASE feature_name
    WHEN 'detailed_reports' THEN
      RETURN user_tier IN ('basic', 'professional');
    WHEN 'consultant_access' THEN
      RETURN user_tier = 'professional';
    WHEN 'priority_support' THEN
      RETURN user_tier IN ('basic', 'professional');
    WHEN 'unlimited_assessments' THEN
      RETURN user_tier IN ('basic', 'professional');
    ELSE
      RETURN true; -- Default to allowing access
  END CASE;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access audit logs
CREATE POLICY "Only service role can access audit logs" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.user_id(), row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.user_id(), row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.user_id(), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_user_subscriptions ON user_subscriptions;
CREATE TRIGGER audit_user_subscriptions
  AFTER INSERT OR UPDATE OR DELETE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

DROP TRIGGER IF EXISTS audit_bookings ON bookings;
CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL, -- IP address or user ID
  action text NOT NULL, -- API endpoint or action
  count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, action, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Only service role can manage rate limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  identifier_val text,
  action_val text,
  limit_val integer,
  window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start_time timestamptz;
BEGIN
  window_start_time := date_trunc('hour', now()) + 
    (EXTRACT(minute FROM now())::integer / window_minutes) * (window_minutes || ' minutes')::interval;
  
  INSERT INTO rate_limits (identifier, action, window_start, count)
  VALUES (identifier_val, action_val, window_start_time, 1)
  ON CONFLICT (identifier, action, window_start)
  DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO current_count;
  
  RETURN current_count <= limit_val;
END;
$$;

COMMENT ON MIGRATION IS 'Production security enhancements with RLS policies, audit logging, and rate limiting';