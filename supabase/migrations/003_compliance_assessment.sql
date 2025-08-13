-- Add compliance assessment support to assessment_reports table
-- Migration for regulatory compliance feature (HIPAA, GDPR, CCPA, PCI)

-- Add compliance assessment column to store compliance analysis results
ALTER TABLE assessment_reports 
ADD COLUMN compliance_assessment jsonb DEFAULT NULL;

-- Add comment for the new column
COMMENT ON COLUMN assessment_reports.compliance_assessment IS 'Regulatory compliance assessment results including HIPAA, GDPR, CCPA, PCI scores and violations';

-- Create index for compliance assessment queries
CREATE INDEX idx_assessment_reports_compliance ON assessment_reports USING gin(compliance_assessment);

-- Create a view for compliance summary statistics
CREATE OR REPLACE VIEW compliance_summary AS
SELECT 
  user_id,
  COUNT(*) as total_assessments,
  AVG(CAST(compliance_assessment->>'overallCompliance' AS integer)) as avg_compliance_score,
  AVG(CAST(compliance_assessment->'regulatoryScores'->>'hipaa' AS integer)) as avg_hipaa_score,
  AVG(CAST(compliance_assessment->'regulatoryScores'->>'gdpr' AS integer)) as avg_gdpr_score,
  AVG(CAST(compliance_assessment->'regulatoryScores'->>'ccpa' AS integer)) as avg_ccpa_score,
  AVG(CAST(compliance_assessment->'regulatoryScores'->>'pci' AS integer)) as avg_pci_score,
  COUNT(CASE WHEN compliance_assessment->>'overallCompliance' IS NOT NULL THEN 1 END) as assessments_with_compliance,
  MAX(created_at) as last_assessment_date
FROM assessment_reports
WHERE compliance_assessment IS NOT NULL
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON compliance_summary TO authenticated;

-- Add RLS policy for the view (inherits from underlying table policies)
CREATE POLICY "Users can view their own compliance summary" ON compliance_summary
  FOR SELECT USING (auth.uid() = user_id);

-- Function to extract high-severity compliance violations
CREATE OR REPLACE FUNCTION get_critical_compliance_violations(assessment_data jsonb)
RETURNS TABLE (
  regulation text,
  severity text,
  category text,
  description text,
  remediation text
)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT 
    violation->>'regulation' as regulation,
    violation->>'severity' as severity,
    violation->>'category' as category,
    violation->>'description' as description,
    violation->>'remediation' as remediation
  FROM jsonb_array_elements(assessment_data->'violations') as violation
  WHERE violation->>'severity' IN ('critical', 'high')
  ORDER BY 
    CASE violation->>'severity'
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      ELSE 3
    END;
$$;

-- Function to calculate compliance readiness score
CREATE OR REPLACE FUNCTION calculate_compliance_readiness(assessment_data jsonb)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN assessment_data IS NULL THEN 0
    WHEN CAST(assessment_data->>'overallCompliance' AS integer) >= 90 THEN 100
    WHEN CAST(assessment_data->>'overallCompliance' AS integer) >= 80 THEN 85
    WHEN CAST(assessment_data->>'overallCompliance' AS integer) >= 70 THEN 70
    WHEN CAST(assessment_data->>'overallCompliance' AS integer) >= 60 THEN 60
    ELSE 30
  END;
$$;

COMMENT ON MIGRATION IS 'Add regulatory compliance assessment storage and analysis functions';