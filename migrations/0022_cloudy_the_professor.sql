ALTER TABLE "movement" ADD COLUMN "client_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movement" ADD CONSTRAINT "movement_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
