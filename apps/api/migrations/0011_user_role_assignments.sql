CREATE TABLE public.user_role_assignments (
    user_id UUID PRIMARY KEY REFERENCES neon_auth."user" (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role = 'admin')
);
