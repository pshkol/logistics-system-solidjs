ALTER TABLE "client_debt" DROP CONSTRAINT "client_debt_movement_id_movement_id_fk";
--> statement-breakpoint
ALTER TABLE "movement" ADD COLUMN "customer_debt_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movement" ADD CONSTRAINT "movement_customer_debt_id_client_debt_id_fk" FOREIGN KEY ("customer_debt_id") REFERENCES "public"."client_debt"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "client_debt" DROP COLUMN IF EXISTS "movement_id";