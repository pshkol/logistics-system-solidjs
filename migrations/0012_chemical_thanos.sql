CREATE TABLE IF NOT EXISTS "client_debt" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer,
	"amount" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_debt" ADD CONSTRAINT "client_debt_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
