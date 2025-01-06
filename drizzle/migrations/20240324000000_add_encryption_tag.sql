ALTER TABLE email_accounts ADD COLUMN encryption_tag text NOT NULL DEFAULT '';
-- backfill existing rows with empty tags since we'll regenerate them on next access
UPDATE email_accounts SET encryption_tag = '';
ALTER TABLE email_accounts ALTER COLUMN encryption_tag DROP DEFAULT; 