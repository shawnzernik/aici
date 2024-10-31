CREATE TABLE "memberships" (
	"guid" UUID PRIMARY KEY,

	"groups_guid" UUID NOT NULL,
	"users_guid" UUID NOT NULL,

	"is_included" BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE "memberships" ADD CONSTRAINT "uk_memberships_groups_guid_users_guid" UNIQUE ("groups_guid", "users_guid");