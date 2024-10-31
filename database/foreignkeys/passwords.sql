ALTER TABLE "passwords" ADD CONSTRAINT "fk_passwords_users_guid" 
FOREIGN KEY ("users_guid") REFERENCES "users" ("guid");