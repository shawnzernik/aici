CREATE TABLE "permissions" (
	"guid" UUID PRIMARY KEY,

	"groups_guid" UUID NOT NULL,
	"securables_guid" UUID NOT NULL,

	"is_allowed" BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE "permissions" ADD CONSTRAINT "uk_permissions_groups_guid_securables_guid" UNIQUE ("groups_guid", "securables_guid");