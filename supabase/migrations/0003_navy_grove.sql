/*
  # Create admin user for development

  Creates a default admin user for development purposes with:
  - Email: admin@example.com
  - Password: admin123
*/

-- Create admin user if it doesn't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert into public users table
INSERT INTO public.users (
  id,
  email,
  role,
  available_tokens,
  has_completed_onboarding
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  'admin',
  1000,
  true
) ON CONFLICT (id) DO NOTHING;