ALTER TABLE "movement" ADD COLUMN "driver_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movement" ADD CONSTRAINT "movement_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
