CREATE TYPE "public"."acao_xp" AS ENUM('compra', 'avaliacao', 'indicacao', 'ugc', 'outro');--> statement-breakpoint
CREATE TYPE "public"."beneficio_tipo" AS ENUM('cupom', 'cashback', 'frete_gratis', 'brinde', 'desconto', 'produto_exclusivo', 'acesso_antecipado');--> statement-breakpoint
CREATE TYPE "public"."indicacao_status" AS ENUM('enviado', 'cadastrado', 'comprou');--> statement-breakpoint
CREATE TYPE "public"."origem_compra" AS ENUM('klub', 'direta');--> statement-breakpoint
CREATE TYPE "public"."plano" AS ENUM('basico', 'drops', 'completo');--> statement-breakpoint
CREATE TYPE "public"."post_tipo" AS ENUM('foto', 'video', 'texto');--> statement-breakpoint
CREATE TABLE "beneficios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"tipo" "beneficio_tipo" NOT NULL,
	"nome" text NOT NULL,
	"valor" text,
	"nivel_id" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campanhas_indicacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"recompensa_indicado" text,
	"recompensa_indicador_xp" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comentarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"membro_id" uuid NOT NULL,
	"conteudo" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"membro_id" uuid NOT NULL,
	"valor" numeric(12, 2) NOT NULL,
	"produto_nome" text,
	"origem" "origem_compra" DEFAULT 'direta' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conquistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"icone" text,
	"criterio" text
);
--> statement-breakpoint
CREATE TABLE "curtidas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"membro_id" uuid NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"produto_nome" text NOT NULL,
	"produto_link" text,
	"data_liberacao" timestamp NOT NULL,
	"nivel_minimo_id" uuid,
	"beneficio_id" uuid,
	"estoque" integer DEFAULT 0 NOT NULL,
	"vendidos" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campanha_id" uuid NOT NULL,
	"membro_indicador_id" uuid NOT NULL,
	"email_indicado" text NOT NULL,
	"status" "indicacao_status" DEFAULT 'enviado' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lojas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"cor_primaria" text,
	"plano" "plano" DEFAULT 'basico' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lojas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "membro_conquistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"membro_id" uuid NOT NULL,
	"conquista_id" uuid NOT NULL,
	"desbloqueada_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"foto_url" text,
	"nivel_id" uuid,
	"xp_total" integer DEFAULT 0 NOT NULL,
	"pontos_disponiveis" integer DEFAULT 0 NOT NULL,
	"entrou_em" timestamp DEFAULT now() NOT NULL,
	"ultima_compra_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "niveis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"icone" text,
	"xp_necessario" integer DEFAULT 0 NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"autor_membro_id" uuid,
	"tipo" "post_tipo" DEFAULT 'texto' NOT NULL,
	"conteudo" text,
	"midia_url" text,
	"fixado" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regras_xp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loja_id" uuid NOT NULL,
	"acao" "acao_xp" NOT NULL,
	"xp_valor" integer NOT NULL,
	"descricao" text
);
--> statement-breakpoint
ALTER TABLE "beneficios" ADD CONSTRAINT "beneficios_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beneficios" ADD CONSTRAINT "beneficios_nivel_id_niveis_id_fk" FOREIGN KEY ("nivel_id") REFERENCES "public"."niveis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campanhas_indicacao" ADD CONSTRAINT "campanhas_indicacao_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_membro_id_membros_id_fk" FOREIGN KEY ("membro_id") REFERENCES "public"."membros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compras" ADD CONSTRAINT "compras_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compras" ADD CONSTRAINT "compras_membro_id_membros_id_fk" FOREIGN KEY ("membro_id") REFERENCES "public"."membros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conquistas" ADD CONSTRAINT "conquistas_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_membro_id_membros_id_fk" FOREIGN KEY ("membro_id") REFERENCES "public"."membros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drops" ADD CONSTRAINT "drops_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drops" ADD CONSTRAINT "drops_nivel_minimo_id_niveis_id_fk" FOREIGN KEY ("nivel_minimo_id") REFERENCES "public"."niveis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drops" ADD CONSTRAINT "drops_beneficio_id_beneficios_id_fk" FOREIGN KEY ("beneficio_id") REFERENCES "public"."beneficios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicacoes" ADD CONSTRAINT "indicacoes_campanha_id_campanhas_indicacao_id_fk" FOREIGN KEY ("campanha_id") REFERENCES "public"."campanhas_indicacao"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicacoes" ADD CONSTRAINT "indicacoes_membro_indicador_id_membros_id_fk" FOREIGN KEY ("membro_indicador_id") REFERENCES "public"."membros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membro_conquistas" ADD CONSTRAINT "membro_conquistas_membro_id_membros_id_fk" FOREIGN KEY ("membro_id") REFERENCES "public"."membros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membro_conquistas" ADD CONSTRAINT "membro_conquistas_conquista_id_conquistas_id_fk" FOREIGN KEY ("conquista_id") REFERENCES "public"."conquistas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membros" ADD CONSTRAINT "membros_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membros" ADD CONSTRAINT "membros_nivel_id_niveis_id_fk" FOREIGN KEY ("nivel_id") REFERENCES "public"."niveis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "niveis" ADD CONSTRAINT "niveis_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_autor_membro_id_membros_id_fk" FOREIGN KEY ("autor_membro_id") REFERENCES "public"."membros"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regras_xp" ADD CONSTRAINT "regras_xp_loja_id_lojas_id_fk" FOREIGN KEY ("loja_id") REFERENCES "public"."lojas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "curtidas_post_membro_idx" ON "curtidas" USING btree ("post_id","membro_id");--> statement-breakpoint
CREATE UNIQUE INDEX "membro_conquistas_idx" ON "membro_conquistas" USING btree ("membro_id","conquista_id");