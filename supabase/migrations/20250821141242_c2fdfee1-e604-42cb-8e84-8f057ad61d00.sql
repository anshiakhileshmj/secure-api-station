
-- Create partner_id column in api_keys table if it doesn't exist with proper constraints
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'partner_id') THEN
        ALTER TABLE api_keys ADD COLUMN partner_id TEXT;
    END IF;
END $$;

-- Update existing api_keys to have partner_id (using user_id as fallback)
UPDATE api_keys 
SET partner_id = COALESCE(partner_id, user_id::text) 
WHERE partner_id IS NULL;

-- Create sanctioned_wallets table if it doesn't exist
CREATE TABLE IF NOT EXISTS sanctioned_wallets (
    address TEXT PRIMARY KEY,
    source TEXT NOT NULL DEFAULT 'OFAC',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS risk_scores (
    wallet TEXT PRIMARY KEY,
    score INTEGER NOT NULL DEFAULT 0,
    band TEXT NOT NULL DEFAULT 'LOW',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS risk_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet TEXT NOT NULL,
    feature TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    weight_applied INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sanctioned_wallets
ALTER TABLE sanctioned_wallets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sanctioned_wallets
DROP POLICY IF EXISTS "Allow public read access to sanctioned wallets" ON sanctioned_wallets;
CREATE POLICY "Allow public read access to sanctioned wallets" 
ON sanctioned_wallets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access to sanctioned wallets" ON sanctioned_wallets;
CREATE POLICY "Allow service role full access to sanctioned wallets" 
ON sanctioned_wallets FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Enable RLS on risk_scores
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for risk_scores
DROP POLICY IF EXISTS "Allow public read access to risk scores" ON risk_scores;
CREATE POLICY "Allow public read access to risk scores" 
ON risk_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access to risk scores" ON risk_scores;
CREATE POLICY "Allow service role full access to risk scores" 
ON risk_scores FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Enable RLS on risk_events
ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for risk_events
DROP POLICY IF EXISTS "Allow service role full access to risk events" ON risk_events;
CREATE POLICY "Allow service role full access to risk events" 
ON risk_events FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Update relay_logs RLS policy to work with partner_id from api_keys
DROP POLICY IF EXISTS "Users can view their own relay logs" ON relay_logs;
CREATE POLICY "Users can view their own relay logs" 
ON relay_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM api_keys 
        WHERE api_keys.partner_id = relay_logs.partner_id 
        AND api_keys.user_id = auth.uid()
    )
);
