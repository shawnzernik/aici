CREATE TABLE "securables" (
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL
);

ALTER TABLE "securables" ADD CONSTRAINT "uk_securables_display_name" UNIQUE ("display_name");