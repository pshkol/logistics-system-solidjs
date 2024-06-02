ALTER TABLE "client_debt" ALTER COLUMN "client_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "movement_type" ADD COLUMN "is_client_required" boolean NOT NULL;