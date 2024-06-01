CREATE TABLE IF NOT EXISTS "movement_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
