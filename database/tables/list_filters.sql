CREATE TABLE "list_filters" ( 
    "guid" UUID PRIMARY KEY,
    "lists_guid" UUID NOT NULL,

    "label" VARCHAR(100) NOT NULL,

    "sql_column" VARCHAR(100) NOT NULL,
    "sql_type" VARCHAR(50) NOT NULL,

    "options_sql" TEXT,

    "default_compare" VARCHAR(3), -- e, ne, lt, gt, lte, gte, nn, n, c, dnc
    "default_value" VARCHAR(100)
)