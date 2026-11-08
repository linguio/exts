ALTER TABLE public.user_settings ADD COLUMN created_at TIMESTAMPTZ;

-- 旧记录没有真实创建时间，以已有更新时间近似回填。
UPDATE public.user_settings SET created_at = updated_at;

ALTER TABLE public.user_settings
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL;
