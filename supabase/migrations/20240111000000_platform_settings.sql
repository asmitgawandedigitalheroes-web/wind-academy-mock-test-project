-- Create platform_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    platform_name TEXT DEFAULT 'Wings Academy',
    support_email TEXT DEFAULT 'info@wingsacademy.ae',
    support_phone TEXT DEFAULT '+971 4 123 4567',
    office_address TEXT DEFAULT 'Aviation Center Blvd, Suite 100, Dubai, UAE',
    maintenance_mode BOOLEAN DEFAULT false,
    default_test_price NUMERIC DEFAULT 199.00,
    facebook_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::UUID)
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to platform_settings"
ON public.platform_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Allow admins to update
CREATE POLICY "Allow admins to update platform_settings"
ON public.platform_settings FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Insert initial record if not exists
INSERT INTO public.platform_settings (id)
VALUES ('00000000-0000-0000-0000-000000000000'::UUID)
ON CONFLICT (id) DO NOTHING;
