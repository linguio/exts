-- 归属与在维护的交付类别对齐，保留已有有效值的 UUID 和显示名。
DELETE FROM public.dictionary_items AS items
USING public.dictionary_groups AS groups
WHERE items.group_id = groups.id
    AND groups.key = 'scope'
    AND items.value IN ('x-download', 'x-download-helper', 'tg-download',
                        'ohmy-photos', 'wxt-stable-output', 'activity');

WITH scope_order(value, label, sort_order) AS (
    VALUES ('website', 'Website', 10), ('extension', 'Extension', 20),
           ('desktop', 'Desktop', 30), ('api', 'API', 40),
           ('packages', 'Packages', 50), ('build', 'Build', 60),
           ('skills', 'Skills', 70), ('repo', 'Repository', 80)
)
INSERT INTO public.dictionary_items (group_id, value, label, sort_order)
SELECT groups.id, scope_order.value, scope_order.label, scope_order.sort_order
FROM scope_order
CROSS JOIN public.dictionary_groups AS groups
WHERE groups.key = 'scope'
ON CONFLICT (group_id, value) DO UPDATE SET sort_order = EXCLUDED.sort_order;
