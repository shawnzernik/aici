INSERT INTO "settings" ("guid", "key", "value") VALUES
('b7d8c935-7c19-47f9-bc93-9f62b4a9fbc7', 'Password:Iterations', '1000000'),
('cad42e40-53a7-4893-a289-c4dcb19aa022', 'Password:Minimum Length', '8'),
('6c34e0f7-e03c-4aa0-9464-89b516f200ce', 'Password:Require Uppercase', 'y'),
('a8e6763b-f294-4af8-be7d-94aa259302ac', 'Password:Require Lowercase', 'y'),
('10e965e6-208f-4c25-9c1e-0dba7008662d', 'Password:Require Numbers', 'y'),
('1cbb9527-afab-4d0d-a101-7a53d15359bc', 'Password:Require Symbols', 'y'),
--('1ad66e51-dcbf-4eea-ba53-f420e8627658', 'Aici:Model', 'gpt-4o-mini'),
('1ad66e51-dcbf-4eea-ba53-f420e8627658', 'Aici:Model', 'ft:gpt-4o-mini-2024-07-18:personal:202410201854:AKaNFJLe'),
('e0f051dc-ee5b-4d84-9f62-8fc687f09663', 'Aici:Finetune:Model', 'gpt-4o-mini-2024-07-18'),
('c3e92f5a-63eb-4749-aa6b-e110151477a0', 'Aici:URL', 'https://api.openai.com'),
('4bcb2ae1-7c9d-4e19-a380-0abddcba8c18', 'Aici:API Key', 'YOU OPEN AI KEY HERE'),
('5cf54ca9-a9cb-46d6-bc9a-f1e63c30bd15', 'Aici:Project', '/Users/shawn/Projects/dotnet-fw2core'),

('5f0c748e-c86d-43a2-aefa-1ea7b96563b6', 'Aici:Download:Confidence', '0.74'),
('96de4956-9018-47d2-a50d-fe071ac58338', 'Aici:Upload:Include', '
\.ts$
\.tsx$
\.sql$
\.json$
\.sh$
\.css$
\.js$
\.html$
\.md$
\.xml$
\.java$
\.css$
\.txt$
\.jsp$
\.config$
\.template$
\.code-workspace$
'),
('f7abd78d-d495-4bc2-a753-1d780b789098', 'Aici:Upload:Exclude', '
frontend/scripts
node_modules
bin
obj
dist
coverage
nbproject
jquery-ui-
__MACOSX
package-lock
\.ds\.json$
')
;