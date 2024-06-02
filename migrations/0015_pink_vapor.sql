ALTER TABLE "client_debt" ADD COLUMN "movement_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_debt" ADD CONSTRAINT "client_debt_movement_id_movement_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
