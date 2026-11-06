CREATE TABLE public.activity_daily_records (
    user_id UUID NOT NULL REFERENCES neon_auth."user" (id),
    date DATE NOT NULL,
    exercise_minutes INTEGER DEFAULT NULL CHECK (exercise_minutes >= 0),
    reading_minutes INTEGER DEFAULT NULL CHECK (reading_minutes >= 0),
    learning_minutes INTEGER DEFAULT NULL CHECK (learning_minutes >= 0),
    creation_minutes INTEGER DEFAULT NULL CHECK (creation_minutes >= 0),
    sleep_minutes INTEGER DEFAULT NULL CHECK (sleep_minutes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, date)
);

CREATE FUNCTION public.activity_set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER activity_update_timestamp
BEFORE UPDATE ON public.activity_daily_records
FOR EACH ROW EXECUTE FUNCTION public.activity_set_updated_at();

-- 根据当前管理连接确定数据库，不硬编码生产数据库名。
DO $$
BEGIN
    EXECUTE format('ALTER DATABASE %I SET timezone TO %L', current_database(), 'Asia/Shanghai');
END;
$$;
