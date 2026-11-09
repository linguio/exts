-- 为每日记录与用户设置补充独立 UUID 主键，保留原有业务唯一约束。

ALTER TABLE public.activity_daily_records ADD COLUMN id UUID;

UPDATE public.activity_daily_records SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE public.activity_daily_records
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.activity_daily_records DROP CONSTRAINT activity_daily_records_pkey;

ALTER TABLE public.activity_daily_records
    ADD CONSTRAINT activity_daily_records_pkey PRIMARY KEY (id);

ALTER TABLE public.activity_daily_records
    ADD CONSTRAINT activity_daily_records_user_id_date_key UNIQUE (user_id, date);

ALTER TABLE public.user_settings ADD COLUMN id UUID;

UPDATE public.user_settings SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE public.user_settings
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.user_settings DROP CONSTRAINT user_settings_pkey;

ALTER TABLE public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);

ALTER TABLE public.user_settings
    ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);
