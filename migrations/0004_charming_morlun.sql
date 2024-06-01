ALTER TABLE "movements" RENAME TO "movement";--> statement-breakpoint
ALTER TABLE "movement" DROP CONSTRAINT "movements_movement_type_id_movement_type_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movement" ADD CONSTRAINT "movement_movement_type_id_movement_type_id_fk" FOREIGN KEY ("movement_type_id") REFERENCES "public"."movement_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
