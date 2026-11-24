CREATE TABLE public.dictionary_namespaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE CHECK (btrim(key) <> ''),
    label TEXT NOT NULL CHECK (btrim(label) <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dictionary_groups
    ADD COLUMN namespace_id UUID REFERENCES public.dictionary_namespaces(id) ON DELETE RESTRICT;

WITH issue_namespace AS (
    INSERT INTO public.dictionary_namespaces (key, label)
    VALUES ('issue', 'Issue')
    RETURNING id
)
UPDATE public.dictionary_groups
SET namespace_id = issue_namespace.id
FROM issue_namespace
WHERE dictionary_groups.key IN ('status', 'scope', 'type');

ALTER TABLE public.dictionary_groups
    ALTER COLUMN namespace_id SET NOT NULL,
    DROP CONSTRAINT dictionary_groups_key_key,
    ADD UNIQUE (namespace_id, key);
