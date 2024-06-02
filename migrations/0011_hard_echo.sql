DO $$ BEGIN
 CREATE TYPE "public"."movement_special_type" AS ENUM('DELIVERY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "movement_type" ADD COLUMN "movement_special_type" "movement_special_type";