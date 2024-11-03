CREATE TABLE "passwords" (
	"guid" UUID PRIMARY KEY,

	"users_guid" UUID NOT NULL,
	"created" TIMESTAMP NOT NULL,

	"salt" VARCHAR(150) NOT NULL,
	"hash" VARCHAR(1100) NOT NULL,
	"iterations" INT NOT NULL
);