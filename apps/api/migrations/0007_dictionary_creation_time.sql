ALTER TABLE public.dictionary_groups ADD COLUMN created_at TIMESTAMPTZ;
ALTER TABLE public.dictionary_items ADD COLUMN created_at TIMESTAMPTZ;

-- 已有字典行由 0006 初始化，优先使用该迁移登记的执行时间。
DO $$
DECLARE
    seed_created_at TIMESTAMPTZ;
BEGIN
    IF to_regclass('public._exts_migrations') IS NOT NULL THEN
        SELECT applied_at INTO seed_created_at
        FROM public._exts_migrations WHERE name = '0006_dictionaries.sql';
    END IF;
    seed_created_at := COALESCE(seed_created_at, CURRENT_TIMESTAMP);
    UPDATE public.dictionary_groups SET created_at = seed_created_at;
    UPDATE public.dictionary_items SET created_at = seed_created_at;
END $$;

ALTER TABLE public.dictionary_groups
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL,
    DROP COLUMN sort_order;

ALTER TABLE public.dictionary_items
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN created_at SET NOT NULL;
