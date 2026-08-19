import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const planoEnum = pgEnum("plano", ["basico", "drops", "completo"]);
export const acaoXpEnum = pgEnum("acao_xp", [
  "compra",
  "avaliacao",
  "indicacao",
  "ugc",
  "outro",
]);
export const beneficioTipoEnum = pgEnum("beneficio_tipo", [
  "cupom",
  "cashback",
  "frete_gratis",
  "brinde",
  "desconto",
  "produto_exclusivo",
  "acesso_antecipado",
]);
export const origemCompraEnum = pgEnum("origem_compra", ["klub", "direta"]);
export const postTipoEnum = pgEnum("post_tipo", ["foto", "video", "texto"]);
export const indicacaoStatusEnum = pgEnum("indicacao_status", [
  "enviado",
  "cadastrado",
  "comprou",
]);

export const lojas = pgTable("lojas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  corPrimaria: text("cor_primaria"),
  plano: planoEnum("plano").notNull().default("basico"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const niveis = pgTable("niveis", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  icone: text("icone"),
  xpNecessario: integer("xp_necessario").notNull().default(0),
  ordem: integer("ordem").notNull().default(0),
});

export const regrasXp = pgTable("regras_xp", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  acao: acaoXpEnum("acao").notNull(),
  xpValor: integer("xp_valor").notNull(),
  descricao: text("descricao"),
});

export const conquistas = pgTable("conquistas", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  icone: text("icone"),
  criterio: text("criterio"),
});

export const beneficios = pgTable("beneficios", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  tipo: beneficioTipoEnum("tipo").notNull(),
  nome: text("nome").notNull(),
  valor: text("valor"),
  nivelId: uuid("nivel_id").references(() => niveis.id, {
    onDelete: "set null",
  }),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const drops = pgTable("drops", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  produtoNome: text("produto_nome").notNull(),
  produtoLink: text("produto_link"),
  dataLiberacao: timestamp("data_liberacao").notNull(),
  nivelMinimoId: uuid("nivel_minimo_id").references(() => niveis.id, {
    onDelete: "set null",
  }),
  beneficioId: uuid("beneficio_id").references(() => beneficios.id, {
    onDelete: "set null",
  }),
  estoque: integer("estoque").notNull().default(0),
  vendidos: integer("vendidos").notNull().default(0),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const membros = pgTable("membros", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  fotoUrl: text("foto_url"),
  nivelId: uuid("nivel_id").references(() => niveis.id, {
    onDelete: "set null",
  }),
  xpTotal: integer("xp_total").notNull().default(0),
  pontosDisponiveis: integer("pontos_disponiveis").notNull().default(0),
  entrouEm: timestamp("entrou_em").notNull().defaultNow(),
  ultimaCompraEm: timestamp("ultima_compra_em"),
});

export const compras = pgTable("compras", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  membroId: uuid("membro_id")
    .notNull()
    .references(() => membros.id, { onDelete: "cascade" }),
  valor: numeric("valor", { precision: 12, scale: 2 }).notNull(),
  produtoNome: text("produto_nome"),
  origem: origemCompraEnum("origem").notNull().default("direta"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  autorMembroId: uuid("autor_membro_id").references(() => membros.id, {
    onDelete: "set null",
  }),
  tipo: postTipoEnum("tipo").notNull().default("texto"),
  conteudo: text("conteudo"),
  midiaUrl: text("midia_url"),
  fixado: boolean("fixado").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const comentarios = pgTable("comentarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  membroId: uuid("membro_id")
    .notNull()
    .references(() => membros.id, { onDelete: "cascade" }),
  conteudo: text("conteudo").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const curtidas = pgTable(
  "curtidas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    membroId: uuid("membro_id")
      .notNull()
      .references(() => membros.id, { onDelete: "cascade" }),
    criadoEm: timestamp("criado_em").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("curtidas_post_membro_idx").on(table.postId, table.membroId)],
);

export const membroConquistas = pgTable(
  "membro_conquistas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    membroId: uuid("membro_id")
      .notNull()
      .references(() => membros.id, { onDelete: "cascade" }),
    conquistaId: uuid("conquista_id")
      .notNull()
      .references(() => conquistas.id, { onDelete: "cascade" }),
    desbloqueadaEm: timestamp("desbloqueada_em").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("membro_conquistas_idx").on(table.membroId, table.conquistaId),
  ],
);

export const campanhasIndicacao = pgTable("campanhas_indicacao", {
  id: uuid("id").primaryKey().defaultRandom(),
  lojaId: uuid("loja_id")
    .notNull()
    .references(() => lojas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  recompensaIndicado: text("recompensa_indicado"),
  recompensaIndicadorXp: integer("recompensa_indicador_xp").notNull().default(0),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});

export const indicacoes = pgTable("indicacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  campanhaId: uuid("campanha_id")
    .notNull()
    .references(() => campanhasIndicacao.id, { onDelete: "cascade" }),
  membroIndicadorId: uuid("membro_indicador_id")
    .notNull()
    .references(() => membros.id, { onDelete: "cascade" }),
  emailIndicado: text("email_indicado").notNull(),
  status: indicacaoStatusEnum("status").notNull().default("enviado"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
});
