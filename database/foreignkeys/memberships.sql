ALTER TABLE "memberships" ADD CONSTRAINT "fk_memberships_users_guid" 
FOREIGN KEY ("users_guid") REFERENCES "users" ("guid");

ALTER TABLE "memberships" ADD CONSTRAINT "fk_memberships_groups_guid" 
FOREIGN KEY ("groups_guid") REFERENCES "groups" ("guid");