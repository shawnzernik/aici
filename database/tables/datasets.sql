CREATE TABLE "datasets" ( 
    "guid" UUID PRIMARY KEY,
    "include_in_training" BOOLEAN DEFAULT FALSE,
    "is_uploaded" BOOLEAN DEFAULT FALSE,
	"title" VARCHAR(1024) NOT NULL,
    "json" TEXT NOT NULL
)