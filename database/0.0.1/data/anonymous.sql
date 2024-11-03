CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "users" ("guid", "display_name", "email_address", "sms_phone")
VALUES ('366d7293-210e-4097-bc5d-ed1c602e7d2e', 'Anonymous', 'anonymous@localhost', '555-555-5555');

INSERT INTO "groups" ("guid", "display_name", "is_administrator")
VALUES ('91a56f4a-1c63-4fe2-8450-2645d12fd9b9', 'Anonymous', FALSE);

INSERT INTO "memberships" ("guid", "users_guid", "groups_guid", "is_included")
VALUES ('e2b7e07d-12cf-48a5-84e8-1c79f97d43c3', '366d7293-210e-4097-bc5d-ed1c602e7d2e', '91a56f4a-1c63-4fe2-8450-2645d12fd9b9', TRUE);

INSERT INTO "permissions" ("guid", "groups_guid", "securables_guid", "is_allowed")
SELECT 
    uuid_generate_v4(),
    '91a56f4a-1c63-4fe2-8450-2645d12fd9b9',
    s.guid,
    TRUE
FROM "securables" s
WHERE s."guid" IN (
    '1aa6ffbd-0c1d-4b05-913e-41bb9e30ad7b', -- menu:list
    'b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3', -- session
    'db0d6063-2266-4bfb-8c96-44dbb90cddf2', -- session > login
    '5a8a209b-e6c1-42e4-8bc9-f144feec6d8e', -- session > copyright
    '4fa7b2ae-953d-45ed-bc83-2194176b0c59' -- session > help
);