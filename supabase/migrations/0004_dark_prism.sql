/*
  # Initial Schema Setup
  
  1. Tables
    - users
    - email_accounts  
    - qa_entries
    - token_transactions
  
  2. Security
    - Enable RLS
    - Add policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'free',
  available_tokens integer NOT NULL DEFAULT 0,
  monthly_usage integer NOT NULL DEFAULT 0,
  last_usage_reset timestamp with time zone NOT NULL DEFAULT now(),
  has_completed_onboarding boolean NOT NULL DEFAULT false,
  stripe_customer_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Email accounts table
CREATE TABLE IF NOT EXISTS email_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  email text NOT NULL,
  provider text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  last_synced timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Q&A entries table
CREATE TABLE IF NOT EXISTS qa_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  email_id text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  context text,
  confidence integer NOT NULL,
  importance text NOT NULL,
  tags text[],
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Token transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  amount integer NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  stripe_payment_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own email accounts" ON email_accounts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own email accounts" ON email_accounts
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own QA entries" ON qa_entries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own QA entries" ON qa_entries
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own token transactions" ON token_transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());