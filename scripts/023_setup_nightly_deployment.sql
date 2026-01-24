-- Create deployment logs table
CREATE TABLE IF NOT EXISTS deployment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  deployment_id VARCHAR(100),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_details JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deployment_logs_triggered_at ON deployment_logs(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_status ON deployment_logs(status);

-- Enable RLS
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage deployment logs
CREATE POLICY "Service role can manage deployment logs" ON deployment_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow authenticated users to read deployment logs
CREATE POLICY "Authenticated users can read deployment logs" ON deployment_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert initial log entry
INSERT INTO deployment_logs (deployment_type, status, message)
VALUES ('setup', 'completed', 'Nightly deployment system initialized')
ON CONFLICT DO NOTHING;

-- Create function to clean up old deployment logs (keep last 100 entries)
CREATE OR REPLACE FUNCTION cleanup_old_deployment_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM deployment_logs
  WHERE id NOT IN (
    SELECT id FROM deployment_logs
    ORDER BY triggered_at DESC
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION cleanup_old_deployment_logs() TO service_role;

COMMENT ON TABLE deployment_logs IS 'Logs for tracking automatic deployments';
COMMENT ON FUNCTION cleanup_old_deployment_logs IS 'Cleans up old deployment logs, keeping only the latest 100 entries';
