ALTER TABLE "permissions" ADD CONSTRAINT "fk_permissions_groups_guid" 
FOREIGN KEY ("groups_guid") REFERENCES "groups" ("guid");

ALTER TABLE "permissions" ADD CONSTRAINT "fk_permissions_securables_guid" 
FOREIGN KEY ("securables_guid") REFERENCES "securables" ("guid");