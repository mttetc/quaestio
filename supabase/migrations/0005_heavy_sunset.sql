/*
  # Create Admin User
  
  Creates a development admin user with:
  - Email: admin@example.com
  - Password: admin123
*/

-- Create admin user in auth schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      aud,
      instance_id
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '00000000-0000-0000-0000-000000000000'
    );
  END IF;
END $$;

-- Create admin user in public schema
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