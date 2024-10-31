CREATE TABLE "menus" (
	"guid" UUID PRIMARY KEY,
    "parents_guid" UUID,
    "order" INT NOT NULL,
	
    "display" VARCHAR(100) NOT NULL,
	"bootstrap_icon" VARCHAR(100) NOT NULL,
	"url" VARCHAR(250) NOT NULL
);

ALTER TABLE "menus" ADD CONSTRAINT "uk_menus_parents_guid_display" UNIQUE ("parents_guid", "display");
ALTER TABLE "menus" ADD CONSTRAINT "uk_menus_parents_guid_order" UNIQUE ("parents_guid", "order");