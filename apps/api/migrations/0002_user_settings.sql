CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES neon_auth."user" (id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    media_download_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    history_cleaner_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
