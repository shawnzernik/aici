ALTER TABLE "menus" ADD CONSTRAINT "fk_menus_parents_guid" 
FOREIGN KEY ("parents_guid") REFERENCES "menus" ("guid");