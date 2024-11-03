CREATE TABLE "manager_versions" (
	"guid" UUID PRIMARY KEY,

	"version" VARCHAR(32) NOT NULL,
	"occurred" TIMESTAMP NOT NULL,
	"success" BOOLEAN NOT NULL,
	"log" TEXT NOT NULL
);