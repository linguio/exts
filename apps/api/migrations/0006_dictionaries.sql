CREATE TABLE public.dictionary_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE CHECK (btrim(key) <> ''),
    label TEXT NOT NULL CHECK (btrim(label) <> ''),
    sort_order INTEGER NOT NULL CHECK (sort_order >= 0)
);

CREATE TABLE public.dictionary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.dictionary_groups(id),
    value TEXT NOT NULL CHECK (btrim(value) <> ''),
    label TEXT NOT NULL CHECK (btrim(label) <> ''),
    sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
    UNIQUE (group_id, value)
);

INSERT INTO public.dictionary_groups (key, label, sort_order)
VALUES ('status', 'Status', 10), ('scope', 'Scope', 20), ('type', 'Type', 30);

INSERT INTO public.dictionary_items (group_id, value, label, sort_order)
SELECT groups.id, items.value, items.label, items.sort_order
FROM (VALUES
    ('status', 'queued', 'Queued', 10),
    ('status', 'in_progress', 'In Progress', 20),
    ('status', 'awaiting_acceptance', 'Awaiting Acceptance', 30),
    ('status', 'awaiting_commit', 'Awaiting Commit', 40),
    ('status', 'completed', 'Completed', 50),
    ('status', 'cancelled', 'Cancelled', 60),
    ('scope', 'repo', 'Repository', 10),
    ('scope', 'extension', 'Extension', 20),
    ('scope', 'website', 'Website', 30),
    ('scope', 'desktop', 'Desktop', 40),
    ('scope', 'api', 'API', 50),
    ('scope', 'x-download', 'X Download', 60),
    ('scope', 'x-download-helper', 'X Download Helper', 70),
    ('scope', 'tg-download', 'TG Download', 80),
    ('scope', 'ohmy-photos', 'OhMy Photos', 90),
    ('scope', 'wxt-stable-output', 'WXT Stable Output', 100),
    ('scope', 'activity', 'Activity', 110),
    ('scope', 'packages', 'Packages', 120),
    ('type', 'bug', 'Bug', 10),
    ('type', 'feature', 'Feature', 20),
    ('type', 'task', 'Task', 30)
) AS items(group_key, value, label, sort_order)
JOIN public.dictionary_groups AS groups ON groups.key = items.group_key;
