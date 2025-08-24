
-- Add permanent partner_id to developer_profiles table
ALTER TABLE public.developer_profiles 
ADD COLUMN partner_id TEXT UNIQUE;

-- Create function to generate unique partner IDs
CREATE OR REPLACE FUNCTION public.generate_partner_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_partner_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate partner ID with format: partner_[8_random_chars]
    new_partner_id := 'partner_' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM developer_profiles WHERE partner_id = new_partner_id) INTO id_exists;
    
    -- If ID doesn't exist, we can use it
    IF NOT id_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_partner_id;
END;
$$;

-- Update handle_new_user function to generate permanent partner_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.developer_profiles (user_id, company_name, website, api_usage_plan, monthly_request_limit, partner_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'website', ''),
    'free',
    1000,
    generate_partner_id()
  );
  RETURN NEW;
END;
$$;

-- Backfill existing users with partner_ids (for users who don't have one yet)
UPDATE public.developer_profiles 
SET partner_id = generate_partner_id() 
WHERE partner_id IS NULL;

-- Make partner_id NOT NULL after backfill
ALTER TABLE public.developer_profiles 
ALTER COLUMN partner_id SET NOT NULL;
