-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.observations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'uploader')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create observations table
CREATE TABLE public.observations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    species TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    photographer TEXT NOT NULL,
    email TEXT NOT NULL,
    description TEXT,
    coordinates TEXT,
    weather TEXT,
    behavior TEXT,
    image_urls TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles are created on signup" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Observations policies
CREATE POLICY "Anyone can view public observations" ON public.observations
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own observations" ON public.observations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all observations" ON public.observations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Updated policy to allow dev uploads (when user_id is null) and authenticated uploaders/admins
CREATE POLICY "Allow uploads from authenticated uploaders and dev mode" ON public.observations
    FOR INSERT WITH CHECK (
        -- Allow dev uploads (no user_id)
        user_id IS NULL OR
        -- Allow authenticated uploaders and admins
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'uploader')
        )
    );

CREATE POLICY "Users can update own observations" ON public.observations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all observations" ON public.observations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete observations" ON public.observations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_observations_species ON public.observations(species);
CREATE INDEX idx_observations_location ON public.observations(location);
CREATE INDEX idx_observations_date ON public.observations(date);
CREATE INDEX idx_observations_is_public ON public.observations(is_public);
CREATE INDEX idx_observations_user_id ON public.observations(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
