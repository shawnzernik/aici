INSERT INTO LISTS ( "guid", "title", "url_key", "top_menu_guid", "left_menu_guid", "sql", "edit_url", "autoload" ) VALUES
('586aaa93-f0ee-4863-b595-56e8f71dd0ce', 'Dataset List', 'datasets', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '6b8c801f-c6f9-42d6-8502-c2ea75287f26', '
SELECT
    "guid",
    "is_uploaded" AS "Uploaded",
    "include_in_training" AS "Train On",
    "title" AS "Title"
FROM "datasets"
ORDER BY "title"
', '/static/app/pages/dataset.html', 'false'),
('56b85e20-08c5-4ccc-9e1c-319f09908915', 'Prompt List', 'prompts', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '2d926f48-3007-4912-b6e7-a55a2af65d62', '
SELECT
    "guid",
    "title" AS "Title"
FROM "prompts"
ORDER BY "title"
', '/static/app/pages/prompt.html', 'false'),
('8bf5524f-4853-430f-b658-57077937c90e', 'Finetune List', 'finetune', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '1a5073f4-5be7-4b01-af23-11aff07485f3', '
SELECT
    "guid",
    "display_name" AS "Name"
FROM "finetunes"
ORDER BY "display_name"
', '/static/app/pages/finetune.html', 'false');

INSERT INTO "securables" ("guid", "display_name")
SELECT
	"guid",
	CONCAT(
		'List:Item:',
		title
	)
FROM "lists";