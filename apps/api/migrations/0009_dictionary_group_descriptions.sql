ALTER TABLE public.dictionary_groups ADD COLUMN description TEXT;

UPDATE public.dictionary_groups AS groups
SET description = descriptions.description
FROM (VALUES
    ('status', 'Tracks where an issue is in the delivery workflow.'),
    ('scope', 'Identifies the app or project area an issue belongs to.'),
    ('type', 'Classifies the kind of work an issue represents.')
) AS descriptions(key, description)
WHERE groups.key = descriptions.key;
