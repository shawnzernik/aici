CREATE TABLE "users" (
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL,
	"email_address" VARCHAR(250) NOT NULL,
	"sms_phone" VARCHAR(20) NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT "uk_users_email_address" UNIQUE ("email_address");