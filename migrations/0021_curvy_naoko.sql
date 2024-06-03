ALTER TABLE "movement" DROP CONSTRAINT "movement_customer_debt_id_client_debt_id_fk";
--> statement-breakpoint
ALTER TABLE "client_debt" ADD COLUMN "movement_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_debt" ADD CONSTRAINT "client_debt_movement_id_movement_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "movement" DROP COLUMN IF EXISTS "customer_debt_id";