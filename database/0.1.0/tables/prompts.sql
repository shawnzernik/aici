CREATE TABLE "prompts" ( 
    "guid" UUID PRIMARY KEY,
	"title" VARCHAR(1024) NOT NULL,
    "input" VARCHAR(1024),
    "json" TEXT NOT NULL
)