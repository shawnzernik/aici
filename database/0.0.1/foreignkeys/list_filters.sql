ALTER TABLE "list_filters" ADD CONSTRAINT "fk_list_filters_lists_guid" 
FOREIGN KEY ("lists_guid") REFERENCES "lists" ("guid");
