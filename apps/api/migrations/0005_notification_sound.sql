ALTER TABLE public.user_settings
ADD COLUMN notification_sound_enabled BOOLEAN NOT NULL DEFAULT FALSE;
