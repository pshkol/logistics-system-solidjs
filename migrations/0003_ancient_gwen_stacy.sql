CREATE TABLE IF NOT EXISTS "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" text NOT NULL,
	"description" text,
	"movement_type_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movements" ADD CONSTRAINT "movements_movement_type_id_movement_type_id_fk" FOREIGN KEY ("movement_type_id") REFERENCES "public"."movement_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
