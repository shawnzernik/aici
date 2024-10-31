INSERT INTO LISTS ( "guid", "title", "url_key", "top_menu_guid", "left_menu_guid", "sql", "edit_url", "autoload" ) VALUES
( '24ebb2fe-b803-4e6d-8516-155ab0e910ef', 'List List', 'lists', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'e1b4b1c6-0c4f-4a62-9c8f-8c8f3b9a4d61', '
SELECT
	"guid",
	"title" AS "Title",
	"url_key" AS "URL Key",
	"edit_url" AS "Edit URL"
FROM "lists"
ORDER BY "title"
', '/static/pages/list.html', 'false'),
( '59f75ec4-ec64-4b18-906c-8275c9ac7a43', 'Menu List', 'menus', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '35697b22-5894-44e7-b574-d0cf7f63af80', '
SELECT * FROM (
	SELECT
		m."guid",
		CASE 
			WHEN "parents_guid" IS NULL THEN m."display"
			ELSE CONCAT(
	 			(SELECT "display" FROM "menus" pm WHERE pm."guid" = m."parents_guid" LIMIT 1),
	 			'' > '',
	 			m.display
			)
		END AS "Display",	
		m."bootstrap_icon" AS "Icon",
		m."url" AS "URL"
	FROM
		"menus" m
) "sortable" 
ORDER BY "sortable"."Display"
', '/static/pages/menu.html', 'false'),
( '3050d3ae-d26b-4341-a7a2-e75ba40de46d', 'Securable List', 'securables', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '46c065f9-16cc-4b8b-9f22-421177576460', '
SELECT
	s.guid,
	s.display_name AS "Display"
FROM securables s
ORDER BY s.display_name 
', '/static/pages/securable.html', 'false'),
( '220331be-8d3c-4969-b1f2-4bc578038003', 'Group List', 'groups', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'd7db605a-ec82-4da6-8fae-df4d5bfb173d', '
SELECT
	g.guid,
	g.display_name AS "Display",
	g.is_administrator AS "Administrator"
FROM "groups" g
ORDER BY g.display_name 
', '/static/pages/group.html', 'false'),
( 'ac5ee873-c05f-4c64-8ec6-f426f9cd6226', 'User List', 'users', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '67fa4231-5b8e-4639-89cb-5f15a9207a83', '
SELECT
	u.guid,
	u.email_address AS "Email",
	u.display_name AS "Name",
	u.sms_phone AS "Phone"
FROM "users" u
ORDER BY u.email_address
', '/static/pages/user.html', 'false'),
( '51ec361f-8a5c-46b2-8c51-68e8516b046f', 'Setting List', 'settings', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'ac781ba3-dd39-4c4f-a68b-4894d733cccb', '
SELECT
	"guid",
	"key" AS "Key",
	"value" AS "Value"
FROM "settings"
ORDER BY "key"
', '/static/pages/setting.html', 'false'),
('586aaa93-f0ee-4863-b595-56e8f71dd0ce', 'Dataset List', 'datasets', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '6b8c801f-c6f9-42d6-8502-c2ea75287f26', '
SELECT
    "guid",
    "is_uploaded" AS "Uploaded",
    "include_in_training" AS "Train On",
    "title" AS "Title"
FROM "datasets"
ORDER BY "title"
', '/static/pages/dataset.html', 'false'),
('56b85e20-08c5-4ccc-9e1c-319f09908915', 'Prompt List', 'prompts', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '2d926f48-3007-4912-b6e7-a55a2af65d62', '
SELECT
    "guid",
    "title" AS "Title"
FROM "prompts"
ORDER BY "title"
', '/static/pages/prompt.html', 'false'),
('8bf5524f-4853-430f-b658-57077937c90e', 'Finetune List', 'finetune', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', '1a5073f4-5be7-4b01-af23-11aff07485f3', '
SELECT
    "guid",
    "display_name" AS "Name"
FROM "finetunes"
ORDER BY "display_name"
', '/static/pages/finetune.html', 'false');

INSERT INTO "securables" ("guid", "display_name")
SELECT
	"guid",
	CONCAT(
		'List:Item:',
		title
	)
FROM "lists";