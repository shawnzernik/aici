CREATE TABLE "logs" (
    "guid" UUID NOT NULL PRIMARY KEY,
    "order" BIGSERIAL,
    "corelation" UUID NOT NULL,
    "epoch" VARCHAR(50) NOT NULL,
    "level" VARCHAR(5) NOT NULL,
    "caller" VARCHAR(2048) NOT NULL,
    "message" TEXT
);