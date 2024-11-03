CREATE TABLE "groups" (
	"guid" UUID PRIMARY KEY,
	"display_name" VARCHAR(100) NOT NULL,
	"is_administrator" BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE "groups" ADD CONSTRAINT "uk_groups_display_name" UNIQUE ("display_name");