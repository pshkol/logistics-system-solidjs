ALTER TABLE "movement_type" ADD COLUMN "do_create_client_debt" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "movement_type" DROP COLUMN IF EXISTS "movement_special_type";