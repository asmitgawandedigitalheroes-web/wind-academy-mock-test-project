-- Create exam_violations table for anti-cheating system
CREATE TABLE IF NOT EXISTS exam_violations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL,
  violation_type VARCHAR(50) NOT NULL CHECK (
    violation_type IN (
      'printscreen',
      'tab_switch', 
      'window_minimize',
      'fullscreen_exit',
      'right_click',
      'devtools',
      'copy_paste',
      'keyboard_shortcut',
      'multi_monitor'
    )
  ),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_violations_user_id ON exam_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_violations_exam_id ON exam_violations(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_violations_timestamp ON exam_violations(timestamp);
CREATE INDEX IF NOT EXISTS idx_exam_violations_type ON exam_violations(violation_type);

-- Create composite index for user exam sessions
CREATE INDEX IF NOT EXISTS idx_exam_violations_user_exam ON exam_violations(user_id, exam_id, timestamp);

-- Enable RLS (Row Level Security)
ALTER TABLE exam_violations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own violations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own exam violations') THEN
        CREATE POLICY "Users can view their own exam violations" ON exam_violations FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create policy for system to insert violations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can insert exam violations') THEN
        CREATE POLICY "System can insert exam violations" ON exam_violations FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Create policy for admins to view all violations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all exam violations') THEN
        CREATE POLICY "Admins can view all exam violations" ON exam_violations
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM auth.users 
              WHERE auth.users.id = auth.uid() 
              AND auth.users.raw_user_meta_data->>'role' = 'admin'
            )
          );
    END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_exam_violations_updated_at') THEN
        CREATE TRIGGER update_exam_violations_updated_at
          BEFORE UPDATE ON exam_violations
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create view for violation analytics
DROP VIEW IF EXISTS exam_violation_summary;
CREATE VIEW exam_violation_summary AS
SELECT 
  user_id,
  exam_id,
  violation_type,
  COUNT(*) as violation_count,
  MIN(timestamp) as first_violation,
  MAX(timestamp) as last_violation,
  details
FROM exam_violations
GROUP BY user_id, exam_id, violation_type, details;

-- Create view for user exam statistics
DROP VIEW IF EXISTS user_exam_stats;
CREATE VIEW user_exam_stats AS
SELECT 
  u.id as user_id,
  u.email,
  ev.exam_id,
  COUNT(*) as total_violations,
  COUNT(DISTINCT ev.violation_type) as unique_violation_types,
  MAX(ev.timestamp) as last_violation_time,
  CASE 
    WHEN COUNT(*) >= 5 THEN 'high_risk'
    WHEN COUNT(*) >= 3 THEN 'medium_risk'
    WHEN COUNT(*) >= 1 THEN 'low_risk'
    ELSE 'no_risk'
  END as risk_level
FROM auth.users u
LEFT JOIN exam_violations ev ON u.id = ev.user_id
GROUP BY u.id, u.email, ev.exam_id;
