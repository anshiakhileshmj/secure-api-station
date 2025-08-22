
-- Safe Enhancement Migration for Existing Risk Scoring System
-- This migration preserves existing data and adds new capabilities

-- First, enhance the existing risk_scores table
ALTER TABLE risk_scores 
ADD COLUMN IF NOT EXISTS id BIGSERIAL,
ADD COLUMN IF NOT EXISTS confidence DECIMAL(3,2) DEFAULT 0.80 CHECK (confidence >= 0.00 AND confidence <= 1.00),
ADD COLUMN IF NOT EXISTS risk_factors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraints to existing risk_scores table
ALTER TABLE risk_scores 
ADD CONSTRAINT IF NOT EXISTS check_risk_scores_score CHECK (score >= 0 AND score <= 100),
ADD CONSTRAINT IF NOT EXISTS check_risk_scores_band CHECK (band IN ('LOW', 'ELEVATED', 'MEDIUM', 'HIGH', 'CRITICAL', 'PROHIBITED'));

-- Enhance the existing risk_events table
ALTER TABLE risk_events 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'BEHAVIORAL',
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ;

-- Populate timestamp from created_at for existing records
UPDATE risk_events SET timestamp = created_at WHERE timestamp IS NULL;

-- Make timestamp NOT NULL after populating
ALTER TABLE risk_events ALTER COLUMN timestamp SET NOT NULL;
ALTER TABLE risk_events ALTER COLUMN timestamp SET DEFAULT NOW();

-- Add constraint to risk_events
ALTER TABLE risk_events 
ADD CONSTRAINT IF NOT EXISTS check_risk_events_weight CHECK (weight_applied >= 0);

-- Create new transaction_patterns table
CREATE TABLE IF NOT EXISTS transaction_patterns (
    id BIGSERIAL PRIMARY KEY,
    wallet TEXT NOT NULL,
    pattern_type TEXT NOT NULL,
    pattern_data JSONB NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.80,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create new network_associations table
CREATE TABLE IF NOT EXISTS network_associations (
    id BIGSERIAL PRIMARY KEY,
    wallet TEXT NOT NULL,
    associated_wallet TEXT NOT NULL,
    association_type TEXT NOT NULL,
    strength DECIMAL(3,2) DEFAULT 1.00,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(wallet, associated_wallet)
);

-- Create new risk_indicators table
CREATE TABLE IF NOT EXISTS risk_indicators (
    id BIGSERIAL PRIMARY KEY,
    indicator_key TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    base_weight DECIMAL(5,2) NOT NULL,
    half_life_days INTEGER NOT NULL DEFAULT 30,
    is_critical BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default risk indicators based on the risk model
INSERT INTO risk_indicators (indicator_key, category, base_weight, half_life_days, is_critical, description) VALUES
    ('SANCTIONS_OFAC', 'SANCTIONS', 100.00, 365, true, 'OFAC sanctions match'),
    ('SANCTIONS_UN', 'SANCTIONS', 100.00, 365, true, 'UN sanctions match'),
    ('MIXER_TORNADO', 'MIXER_TUMBLER', 85.00, 180, true, 'Tornado Cash usage'),
    ('MIXER_PRIVACY', 'MIXER_TUMBLER', 85.00, 180, true, 'Privacy tool usage'),
    ('DEX_UNISWAP_ANON', 'DEX_ANONYMITY', 70.00, 90, false, 'Anonymous Uniswap usage'),
    ('DEX_1INCH_ANON', 'DEX_ANONYMITY', 70.00, 90, false, 'Anonymous 1inch usage'),
    ('HIGH_VALUE_100K', 'HIGH_VALUE', 60.00, 30, false, 'Transaction > $100k'),
    ('HIGH_VALUE_1M', 'HIGH_VALUE', 80.00, 30, false, 'Transaction > $1M'),
    ('VELOCITY_RAPID', 'VELOCITY', 55.00, 14, false, 'Rapid transaction pattern'),
    ('VELOCITY_BURST', 'VELOCITY', 65.00, 14, false, 'Transaction burst pattern'),
    ('CONTRACT_DEFI', 'CONTRACT_INTERACTION', 50.00, 60, false, 'DeFi contract interaction'),
    ('CONTRACT_NFT', 'CONTRACT_INTERACTION', 40.00, 60, false, 'NFT contract interaction'),
    ('MULTI_CHAIN_BRIDGE', 'MULTI_CHAIN', 45.00, 45, false, 'Cross-chain bridge usage'),
    ('MULTI_CHAIN_DEX', 'MULTI_CHAIN', 40.00, 45, false, 'Multi-chain DEX usage'),
    ('BEHAVIOR_ROUND_AMOUNTS', 'BEHAVIORAL', 40.00, 30, false, 'Round amount transactions'),
    ('BEHAVIOR_DUSTING', 'BEHAVIORAL', 50.00, 30, false, 'Dusting attack pattern'),
    ('REPUTATION_BAD_ACTOR', 'REPUTATION', 35.00, 90, false, 'Association with known bad actor'),
    ('REPUTATION_SCAM', 'REPUTATION', 60.00, 90, false, 'Scam contract interaction'),
    ('GEOGRAPHIC_HIGH_RISK', 'GEOGRAPHIC', 30.00, 60, false, 'High-risk jurisdiction activity')
ON CONFLICT (indicator_key) DO NOTHING;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_risk_scores_confidence ON risk_scores(confidence);
CREATE INDEX IF NOT EXISTS idx_risk_scores_created_at ON risk_scores(created_at);

CREATE INDEX IF NOT EXISTS idx_risk_events_category ON risk_events(category);
CREATE INDEX IF NOT EXISTS idx_risk_events_timestamp ON risk_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_transaction_patterns_wallet ON transaction_patterns(wallet);
CREATE INDEX IF NOT EXISTS idx_transaction_patterns_type ON transaction_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_transaction_patterns_active ON transaction_patterns(is_active);

CREATE INDEX IF NOT EXISTS idx_network_associations_wallet ON network_associations(wallet);
CREATE INDEX IF NOT EXISTS idx_network_associations_type ON network_associations(association_type);
CREATE INDEX IF NOT EXISTS idx_network_associations_strength ON network_associations(strength);

CREATE INDEX IF NOT EXISTS idx_risk_indicators_key ON risk_indicators(indicator_key);
CREATE INDEX IF NOT EXISTS idx_risk_indicators_category ON risk_indicators(category);
CREATE INDEX IF NOT EXISTS idx_risk_indicators_active ON risk_indicators(is_active);

-- Create enhanced view for wallet risk analysis
CREATE OR REPLACE VIEW wallet_risk_summary AS
SELECT 
    rs.wallet,
    rs.score,
    rs.band,
    rs.confidence,
    rs.risk_factors,
    rs.updated_at as last_updated,
    rs.created_at,
    COUNT(re.id) as event_count,
    COUNT(DISTINCT re.feature) as unique_features,
    COUNT(DISTINCT re.category) as risk_categories,
    COUNT(tp.id) as pattern_count,
    COUNT(na.id) as association_count
FROM risk_scores rs
LEFT JOIN risk_events re ON rs.wallet = re.wallet
LEFT JOIN transaction_patterns tp ON rs.wallet = tp.wallet AND tp.is_active = true
LEFT JOIN network_associations na ON rs.wallet = na.wallet
GROUP BY rs.wallet, rs.score, rs.band, rs.confidence, rs.risk_factors, rs.updated_at, rs.created_at;

-- Create enhanced function to update risk score with new fields
CREATE OR REPLACE FUNCTION update_risk_score(
    p_wallet TEXT,
    p_score INTEGER,
    p_band TEXT,
    p_confidence DECIMAL DEFAULT 0.80,
    p_risk_factors JSONB DEFAULT '[]'::jsonb
) RETURNS VOID AS $$
BEGIN
    INSERT INTO risk_scores (wallet, score, band, confidence, risk_factors, updated_at, created_at)
    VALUES (p_wallet, p_score, p_band, p_confidence, p_risk_factors, NOW(), NOW())
    ON CONFLICT (wallet) DO UPDATE SET
        score = EXCLUDED.score,
        band = EXCLUDED.band,
        confidence = EXCLUDED.confidence,
        risk_factors = EXCLUDED.risk_factors,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create enhanced function to log risk events with category
CREATE OR REPLACE FUNCTION log_risk_event(
    p_wallet TEXT,
    p_feature TEXT,
    p_category TEXT DEFAULT 'BEHAVIORAL',
    p_details JSONB DEFAULT '{}'::jsonb,
    p_weight_applied INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO risk_events (wallet, feature, category, details, weight_applied, timestamp, created_at)
    VALUES (p_wallet, p_feature, p_category, p_details, p_weight_applied, NOW(), NOW());
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables to match existing security model
ALTER TABLE transaction_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_indicators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (matching existing pattern)
CREATE POLICY "Allow service role full access to transaction patterns" 
ON transaction_patterns FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Allow service role full access to network associations" 
ON network_associations FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Allow public read access to risk indicators" 
ON risk_indicators FOR SELECT 
USING (true);

CREATE POLICY "Allow service role full access to risk indicators" 
ON risk_indicators FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
