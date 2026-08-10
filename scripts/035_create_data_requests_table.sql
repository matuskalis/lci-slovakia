-- Records every request for the full Lesy SR bear dataset: who asked, what they
-- agreed to, when the download link was sent and whether it was used.
CREATE TABLE IF NOT EXISTS data_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    organization TEXT,
    purpose TEXT NOT NULL,
    consent BOOLEAN NOT NULL,
    consent_version TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_data_requests_email ON data_requests(email);
CREATE INDEX IF NOT EXISTS idx_data_requests_created_at ON data_requests(created_at DESC);

-- No policies are defined on purpose: the table holds personal data, so the anon
-- and authenticated roles must never reach it. Only the service role, which
-- bypasses RLS, touches this table from the API routes.
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON data_requests FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON data_requests TO service_role;
