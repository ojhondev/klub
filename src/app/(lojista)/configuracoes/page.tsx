import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { produtos } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { createProduto, deleteProduto } from "./actions";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const inputClass =
  "rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

export default async function ConfiguracoesPage() {
  const session = await requireSession();

  const listaProdutos = await db
    .select()
    .from(produtos)
    .where(eq(produtos.lojaId, session.lojaId))
    .orderBy(desc(produtos.criadoEm));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">⚙️ Configurações</h1>
        <p className="mt-1 text-fg-muted">Marca da loja, integração e catálogo de produtos.</p>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-sm text-fg-muted">
            Cole o link do produto na sua loja (Shopify/Nuvemshop) e preencha os dados
            manualmente — sem integração automática ainda. Esses produtos ficam
            disponíveis para usar em Drops.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-fg-muted">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listaProdutos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-fg-subtle">
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              )}
              {listaProdutos.map((produto) => (
                <tr key={produto.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {produto.imagemUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={produto.imagemUrl}
                          alt=""
                          className="size-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-lg bg-surface-hover" />
                      )}
                      <span className="font-medium">{produto.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {produto.preco !== null ? currency.format(Number(produto.preco)) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={produto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-muted hover:text-accent hover:underline"
                    >
                      abrir ↗
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteProduto}>
                      <input type="hidden" name="id" value={produto.id} />
                      <button type="submit" className="text-sm text-fg-subtle hover:text-danger">
                        remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          action={createProduto}
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex min-w-48 flex-1 flex-col gap-1">
            <label className="text-xs text-fg-muted">Link do produto</label>
            <input
              name="link"
              type="url"
              required
              placeholder="https://minhaloja.com/produto"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Nome</label>
            <input name="nome" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Preço (R$)</label>
            <input
              name="preco"
              type="number"
              min={0}
              step="0.01"
              className={`${inputClass} w-32`}
            />
          </div>
          <div className="flex min-w-48 flex-col gap-1">
            <label className="text-xs text-fg-muted">URL da imagem (opcional)</label>
            <input name="imagemUrl" type="url" className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            Adicionar produto
          </button>
        </form>
      </section>
    </div>
  );
}
