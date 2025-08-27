
-- Add new columns to developer_profiles table to store additional signup information
ALTER TABLE public.developer_profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS business_type text;

-- Update the handle_new_user function to store the additional fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.developer_profiles (
    user_id, 
    first_name,
    last_name,
    company_name, 
    job_title,
    phone,
    country,
    business_type,
    website, 
    api_usage_plan, 
    monthly_request_limit,
    partner_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'job_title', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'country', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'business_type', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'website', ''),
    'free',
    1000,
    generate_partner_id()
  );
  RETURN NEW;
END;
$function$;
