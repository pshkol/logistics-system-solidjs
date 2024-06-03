CREATE TABLE IF NOT EXISTS "debt_to_driver" (
	"id" serial PRIMARY KEY NOT NULL,
	"driver_id" integer NOT NULL,
	"amount" numeric NOT NULL,
	"driver_movement_payment_id" integer,
	"movement_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "debt_to_driver" ADD CONSTRAINT "debt_to_driver_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "debt_to_driver" ADD CONSTRAINT "debt_to_driver_driver_movement_payment_id_driver_movement_payment_id_fk" FOREIGN KEY ("driver_movement_payment_id") REFERENCES "public"."driver_movement_payment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "debt_to_driver" ADD CONSTRAINT "debt_to_driver_movement_id_movement_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
