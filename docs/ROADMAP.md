# Roadmap — Klub Members

> Documento vivo. Versão 0.1 — 2026-08-19. Complementa [PRD.md](PRD.md) §10 (que dá a
> visão macro MVP/V1/V2/Futuro) com passos concretos, em ordem de execução.

## Onde estamos (Fase 0 — concluída)

- Scaffold Next.js + TypeScript + Tailwind v4 + Drizzle, tema escuro estilo Hubla.
- Shell do lado do lojista: sidebar com os 8 pilares + Configurações.
- Dashboard com todos os KPIs do PRD §4.1 — **dados mockados**, sem ligação com banco.
- Schema Drizzle (14 tabelas) migrado no Neon — banco existe, mas nenhuma tela ainda
  lê/escreve nele.
- Infra no ar: GitHub (`ojhondev/klub`), Vercel (`klub-one.vercel.app`), Neon
  (`neon-cobalt-globe`).
- **Sem autenticação.** Qualquer pessoa que acessa a URL vê o dashboard de uma loja
  fictícia — não há login, não há isolamento real de tenant ainda.

---

## Fase 1 — Fundação: autenticação + tenant + dados reais ✅ concluída (2026-08-19)

Sem isso, nada do resto pode sair do mock. É a fase mais estrutural e a que menos
"aparece" visualmente.

- ✅ **Login do lojista** — cadastro (`/cadastro`) + login (`/login`) por e-mail/senha,
  cookie de sessão assinado (HMAC-SHA256 + `SESSION_SECRET`) e hash de senha (scrypt),
  sem provedor externo — `src/lib/auth/`.
- ✅ **Onboarding da loja** — cadastro cria `lojas` (nome, slug único gerado
  automaticamente, plano `basico` por padrão) e `usuarios` (vinculado à loja) na mesma
  ação — `src/app/(auth)/actions.ts`.
- ✅ **Resolução de tenant por sessão** — `(lojista)/layout.tsx` exige sessão válida
  (`requireSession`, redireciona pra `/login` se ausente) e resolve `loja_id` a partir
  dela; nome da loja exibido no header, com botão "Sair".
- ✅ **Trocar o Dashboard de mock para real** — `src/lib/queries/dashboard.ts` calcula
  os KPIs direto das tabelas (`membros`, `compras`, `posts`, `indicacoes`) filtrados por
  `loja_id`. Numa loja nova a maioria vem zerada, como esperado; "LTV dos não membros"
  e "CAC economizado" ficam como "—" porque não há fonte de dado pra eles ainda (MVP
  sem webhook de pedido — ver PRD §11); Klub Growth Score também fica como "—" até
  existir dado suficiente pra calcular a fórmula do PRD §4.1.

**Verificado nesta sessão:** cadastro cria loja+usuário e loga automaticamente, logout
limpa a sessão, login com credencial errada mostra erro, login correto volta ao
dashboard. Isolamento entre lojas ainda não foi testado com duas contas simultâneas
(fica pra Fase 2, quando `membros` reais existirem pra comparar).

**Pronto quando:** dá pra criar duas contas de loja diferentes, logar em cada uma, e
ver que os dados de uma não vazam pra outra.

---

## Fase 2 — Membros (CRM) + Gamificação

As duas telas que sustentam o pilar **Rewards** — e o que dá ao lojista algo
imediatamente útil de configurar.

- **Gamificação** (substituir o placeholder): CRUD de Níveis (nome, ícone, XP
  necessário, ordem) e de Regras de XP (ação → valor). Conquistas fica podendo entrar
  nesta fase ou na seguinte, dependendo do apetite.
- **Membros** (substituir o placeholder): listagem real dos membros da loja com os
  filtros do PRD §4.2 (VIP, inativos, novos, recorrentes, top clientes) e o perfil
  individual do membro (nível, XP, compras, cupons, indicações, UGC).
- **Cadastro de membro** — hoje não existe forma de um cliente virar membro; precisa de
  um fluxo mínimo (manual pelo lojista, ou auto-cadastro simples) para popular a
  tabela `membros` com dados reais e testar a lógica de XP/nível.

**Pronto quando:** o lojista consegue criar um nível, cadastrar um membro, ele
acumular XP por uma ação e subir de nível — tudo refletido na tela de Membros.

---

## Fase 3 — Benefícios + cadastro de produto (link manual)

- **Benefícios** (substituir o placeholder): CRUD dos tipos definidos no PRD §4.4
  (cupom, cashback, frete grátis, brinde, desconto, produto exclusivo, acesso
  antecipado), com o público-alvo por nível.
- **Cadastro de produto via link** — formulário onde o lojista cola o link do produto
  (Shopify/Nuvemshop) e preenche título/imagem/preço manualmente, conforme decisão do
  PRD §6. Sem isso, Drops (Fase 4) não tem o que vincular.

**Pronto quando:** existe um benefício configurado e associado a um nível, e pelo
menos um produto cadastrado via link pronto para ser usado num Drop.

---

## Fase 4 — Drops

- **Drops** (substituir o placeholder): criar drop (produto, data/hora de liberação,
  público-alvo por nível, benefício, estoque), listagem de drops ativos/futuros/
  encerrados, e o resultado pós-drop (% vendido) alimentando o Dashboard.
- **Atribuição de pedido "originado pelo Klub"** — implementar o cupom/UTM único por
  membro ou por drop (decisão do PRD §6), já que não há webhook de pedido no MVP.

**Pronto quando:** um drop criado no admin aparece corretamente restrito ao nível
configurado e o "% vendido pelo Klub" bate com os pedidos atribuídos.

---

## Fase 5 — Comunidade + UGC

Normalmente a fase mais cara de moderar, por isso vem depois das anteriores estarem
sólidas.

- **Comunidade** (substituir o placeholder): feed, posts, comentários, curtidas,
  denúncias, moderação, fixar post/campanha/produto/desafio, hashtags.
- **UGC** (substituir o placeholder): visão dedicada de fotos/vídeos vindos da
  comunidade, aprovação, destaque, "Top UGC do mês", solicitação de autorização de uso.

**Pronto quando:** um post de membro pode ser fixado pelo lojista, moderado, e
aparecer destacado na aba UGC.

---

## Fase 6 — Indicações

- **Indicações** (substituir o placeholder): criação de campanha de referral
  (recompensa do indicado + XP do indicador), geração de link/código por membro,
  dashboard de convites → cliques → cadastros → compras → CAC estimado (PRD §4.8).

**Pronto quando:** um membro indicado se cadastra através do link, e isso aparece no
funil da campanha no admin.

---

## Fase 7 — App do membro (lado consumidor)

Até aqui, tudo foi o lado do lojista. Esta fase entrega a experiência descrita no PRD
§5 para quem é membro: Home/Feed, Perfil/Progresso, Loja/Catálogo, Drops, Comunidade,
Indique e ganhe, Carteira de benefícios, Notificações. Mobile-first, sem PWA — mesmo
padrão de acabamento do admin (referência Hubla).

**Pronto quando:** um membro logado consegue ver seu nível/XP, participar de um drop
liberado pra ele, postar na comunidade e resgatar um benefício da carteira.

---

## Fase 8 — Cobrança do lojista (assinatura)

- Implementar o checkout de assinatura dos 3 planos (R$97/297/597) e o gate de
  funcionalidades por plano (tabela do PRD §7, ainda draft — precisa ficar definitiva
  antes desta fase).
- Provedor de pagamento a definir (mesma decisão que o Stokys já resolveu com Asaas —
  avaliar reaproveitar).

**Pronto quando:** uma loja nova só acessa Drops/Comunidade se estiver no plano que
libera esse pilar, e o upgrade de plano muda isso em tempo real.

---

## Fase 9 e além — Escala

Itens que o PRD já marca como "Futuro" e não bloqueiam nenhuma fase anterior:

- Integração via API/OAuth oficial com Shopify e Nuvemshop (catálogo sincronizado,
  baixa de estoque em tempo real, cupom nativo) — substitui o link manual da Fase 3.
- Klub Growth Score: sair da fórmula v0 (PRD §4.1) para uma calibrada com dados reais
  de lojas piloto.
- Moderação de comunidade assistida por IA (v1 é 100% manual — ver limite no PRD §11).
- App nativo publicado (iOS/Android), se o padrão de acabamento web não for suficiente.

---

## Ordem de dependência (resumo)

```mermaid
flowchart LR
    F1[Fase 1<br/>Auth + Tenant] --> F2[Fase 2<br/>Membros + Gamificação]
    F2 --> F3[Fase 3<br/>Benefícios + Produto]
    F3 --> F4[Fase 4<br/>Drops]
    F2 --> F5[Fase 5<br/>Comunidade + UGC]
    F2 --> F6[Fase 6<br/>Indicações]
    F2 --> F7[Fase 7<br/>App do Membro]
    F4 --> F7
    F5 --> F7
    F6 --> F7
    F7 --> F8[Fase 8<br/>Cobrança]
    F8 --> F9[Fase 9+<br/>Escala]
```

A Fase 1 é o único bloqueador linear real — todo o resto depende dela. Fases 3, 5 e 6
podem ser reordenadas entre si sem grande atrito; a única dependência forte é Fase 3
(produto cadastrado) antes da Fase 4 (Drop precisa de um produto pra vincular).
