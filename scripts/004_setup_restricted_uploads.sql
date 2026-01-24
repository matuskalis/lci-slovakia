-- Update RLS policies for restricted uploads

-- Drop existing observation policies
DROP POLICY IF EXISTS "Uploaders and admins can insert observations" ON public.observations;
DROP POLICY IF EXISTS "Users can update own observations" ON public.observations;
DROP POLICY IF EXISTS "Admins can update all observations" ON public.observations;

-- Create new policies for restricted uploads
CREATE POLICY "Only uploaders and admins can insert observations" ON public.observations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'uploader')
        )
    );

CREATE POLICY "Uploaders can update own observations" ON public.observations
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'uploader')
        )
    );

CREATE POLICY "Admins can update all observations" ON public.observations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add function to check upload permissions
CREATE OR REPLACE FUNCTION public.can_upload()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'uploader')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.observations TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_upload() TO authenticated;
