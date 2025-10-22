CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"thumbnail" varchar,
	"description" text,
	"banner" varchar,
	"slug" varchar(200) NOT NULL,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"category_id" integer
);
--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;