DO $$ BEGIN
 CREATE TYPE "public"."movement_direction_type" AS ENUM('IN', 'OUT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "movement_type" ADD COLUMN "movement_direction_type" "movement_direction_type";--> statement-breakpoint
ALTER TABLE "movement_type" DROP COLUMN IF EXISTS "type";