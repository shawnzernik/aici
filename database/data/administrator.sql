CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "users" ("guid", "display_name", "email_address", "sms_phone")
VALUES ('ea042f97-c8f4-447d-a71b-f4c4e0c77cc7', 'System Administrator', 'administrator@localhost', '555-555-5555');

INSERT INTO "passwords" ("guid", "users_guid", "created", "salt", "iterations", "hash")
VALUES (
    'ecb3185f-74eb-43b4-9b75-97975e312075',
    'ea042f97-c8f4-447d-a71b-f4c4e0c77cc7',
    '1970-01-01 00:00:00',
    '7a2fd8236e85a7b61ad1647c1cb339d6bb8928a9280be136f099ebfddb4dd2ca',
    100000,
    '7ad7627a5addcea3379c367b0ad8f165d0d2bdba0aeb0dfd4f3825f685f036b513bdbd1ce4df4b4d0e277d85ef51868383b291a4acd86fd926150de5c15e34ea'
);

INSERT INTO "groups" ("guid", "display_name", "is_administrator")
VALUES ('046499bd-1f75-4024-b7a9-307e6a99e1ec', 'Administrators', TRUE);

INSERT INTO "memberships" ("guid", "users_guid", "groups_guid", "is_included")
VALUES ('cf6868c0-d8d3-42c7-976e-5a03e4dd1fbc', 'ea042f97-c8f4-447d-a71b-f4c4e0c77cc7', '046499bd-1f75-4024-b7a9-307e6a99e1ec', TRUE);

INSERT INTO "permissions" ("guid", "groups_guid", "securables_guid", "is_allowed")
SELECT 
    uuid_generate_v4(),
    '046499bd-1f75-4024-b7a9-307e6a99e1ec',
    s.guid,
    TRUE
FROM "securables" s
WHERE s."guid" NOT IN (
    'db0d6063-2266-4bfb-8c96-44dbb90cddf2' -- login
);