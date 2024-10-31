CREATE TABLE "lists" ( 
    "guid" UUID PRIMARY KEY,

	"title" VARCHAR(100) NOT NULL,
    "url_key" VARCHAR(100) NOT NULL,

    "top_menu_guid" UUID NOT NULL,
    "left_menu_guid" UUID NOT NULL,

    "sql" TEXT NOT NULL,
    "edit_url" VARCHAR(255),
    "autoload" BOOLEAN NOT NULL DEFAULT FALSE
)