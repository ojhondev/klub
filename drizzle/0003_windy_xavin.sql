ALTER TABLE "drops" ALTER COLUMN "produto_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drops" DROP COLUMN "produto_nome";--> statement-breakpoint
ALTER TABLE "drops" DROP COLUMN "produto_link";