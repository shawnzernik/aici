INSERT INTO "permissions" ("guid", "groups_guid", "securables_guid", "is_allowed")
SELECT 
    uuid_generate_v4(),
    '046499bd-1f75-4024-b7a9-307e6a99e1ec', -- administrators
    s.guid,
    TRUE
FROM "securables" s
WHERE 
    s."guid" NOT IN (
        'db0d6063-2266-4bfb-8c96-44dbb90cddf2' -- login
    )
    AND s.guid NOT IN (
        SELECT "securables_guid" 
        FROM "permissions" 
        WHERE 
            "groups_guid" = '046499bd-1f75-4024-b7a9-307e6a99e1ec' -- administrators
    )