-- Add is_pro column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro);

-- Update existing users to free plan
UPDATE profiles SET is_pro = FALSE WHERE is_pro IS NULL;
