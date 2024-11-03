INSERT INTO lists (guid,title,url_key,top_menu_guid,left_menu_guid,"sql",edit_url,autoload) VALUES
	 ('24ebb2fe-b803-4e6d-8516-155ab0e910ef','List List','lists','b1e3c680-0f62-4931-8a68-4be9b4b070f7','e1b4b1c6-0c4f-4a62-9c8f-8c8f3b9a4d61','SELECT
	"guid",
	"title" AS "Title",
	"url_key" AS "URL Key",
	"edit_url" AS "Edit URL"
FROM "lists"
ORDER BY "title"','/static/tre/pages/list.html',true),
	 ('220331be-8d3c-4969-b1f2-4bc578038003','Group List','groups','b1e3c680-0f62-4931-8a68-4be9b4b070f7','d7db605a-ec82-4da6-8fae-df4d5bfb173d','SELECT
	g.guid,
	g.display_name AS "Display",
	g.is_administrator AS "Administrator"
FROM "groups" g
ORDER BY g.display_name','/static/tre/pages/group.html',true),
	 ('59f75ec4-ec64-4b18-906c-8275c9ac7a43','Menu List','menus','b1e3c680-0f62-4931-8a68-4be9b4b070f7','35697b22-5894-44e7-b574-d0cf7f63af80','SELECT * FROM (
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
ORDER BY "sortable"."Display"','/static/tre/pages/menu.html',true),
	 ('3050d3ae-d26b-4341-a7a2-e75ba40de46d','Securable List','securables','b1e3c680-0f62-4931-8a68-4be9b4b070f7','46c065f9-16cc-4b8b-9f22-421177576460','SELECT
	s.guid,
	s.display_name AS "Display"
FROM securables s
ORDER BY s.display_name','/static/tre/pages/securable.html',true),
	 ('ac5ee873-c05f-4c64-8ec6-f426f9cd6226','User List','users','b1e3c680-0f62-4931-8a68-4be9b4b070f7','67fa4231-5b8e-4639-89cb-5f15a9207a83','SELECT
	u.guid,
	u.email_address AS "Email",
	u.display_name AS "Name",
	u.sms_phone AS "Phone"
FROM "users" u
ORDER BY u.email_address','/static/tre/pages/user.html',true),
	 ('51ec361f-8a5c-46b2-8c51-68e8516b046f','Setting List','settings','b1e3c680-0f62-4931-8a68-4be9b4b070f7','ac781ba3-dd39-4c4f-a68b-4894d733cccb','SELECT
	"guid",
	"key" AS "Key",
	"value" AS "Value"
FROM "settings"
ORDER BY "key"','/static/tre/pages/setting.html',true);
