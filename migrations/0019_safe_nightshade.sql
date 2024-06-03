ALTER TABLE "driver_movement_payment" DROP CONSTRAINT "driver_movement_payment_movement_id_movement_id_fk";
--> statement-breakpoint
ALTER TABLE "driver_movement_payment" ADD COLUMN "movement_type_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_movement_payment" ADD CONSTRAINT "driver_movement_payment_movement_type_id_movement_type_id_fk" FOREIGN KEY ("movement_type_id") REFERENCES "public"."movement_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "driver_movement_payment" DROP COLUMN IF EXISTS "movement_id";