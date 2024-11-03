CREATE TABLE "finetunes" (
	"guid" UUID PRIMARY KEY,

	"display_name" VARCHAR(100) NOT NULL,
    "suffix" VARCHAR(50) NOT NULL,
    "id" VARCHAR(100),

    "model" VARCHAR(100) NOT NULL,
    "epochs" INT,
    "learning_rate_multiplier" NUMERIC,
    "batch_size" INT,
    "seed" INT,

    "training_file" VARCHAR(250),
    "training_data" TEXT NOT NULL,

    "validation_file" VARCHAR(250),
    "validation_data" TEXT
);

ALTER TABLE "finetunes" ADD CONSTRAINT "uk_finetunes_display_name" UNIQUE ("display_name");
ALTER TABLE "finetunes" ADD CONSTRAINT "uk_finetunes_id" UNIQUE ("id");
ALTER TABLE "finetunes" ADD CONSTRAINT "uk_finetunes_suffix" UNIQUE ("suffix");