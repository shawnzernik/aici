CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "menus" ("guid", "parents_guid", "order", "display", "bootstrap_icon", "url") VALUES
('a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', NULL, 2, 'OpenAI Aici', 'fire', ''),
('720fa4c9-20d0-407d-aff6-3dad45d155cc', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 1, 'Upload', 'cloud-arrow-up-fill', '/static/app/pages/upload.html'),
('1a5073f4-5be7-4b01-af23-11aff07485f3', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 2, 'Fine Tune', 'easel-fill', '/static/tre/pages/lists.html?url_key=finetune'),
('f8d6fabe-c73a-4dac-bb4b-c85c776c45c1', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 3, 'Search', 'search', '/static/app/pages/search.html'),
('b3d886a8-dd3d-426a-9ddf-1e18cbb7e224', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 4, 'Chat', 'chat-fill', '/static/app/pages/chat.html'),
('2d926f48-3007-4912-b6e7-a55a2af65d62', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 5, 'Prompts', 'chat-dots-fill', '/static/tre/pages/lists.html?url_key=prompts'),
('6b8c801f-c6f9-42d6-8502-c2ea75287f26', 'a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4', 6, 'Datasets', 'backpack-fill', '/static/tre/pages/lists.html?url_key=datasets')
;

INSERT INTO "securables" ("guid", "display_name")
SELECT 
    m.guid,
    CASE
        WHEN m.parents_guid IS NULL THEN CONCAT('Menu:', m.display)
        ELSE CONCAT(
            'Menu:Item:',
            COALESCE(
                (SELECT p.display FROM "menus" p WHERE m.parents_guid = p.guid LIMIT 1),
                'MISSING'
            ),
            ':',
            m.display
        )
    END
FROM "menus" m
WHERE 
    m.guid NOT IN ( SELECT "guid" from "securables" )