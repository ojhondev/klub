@AGENTS.md

## Git: commit e push automáticos

Toda alteração de código feita neste projeto (nesta ou em sessões futuras) deve ser
commitada e enviada para o GitHub (`origin/main`) automaticamente, sem esperar
autorização explícita a cada vez — isso já foi autorizado pelo usuário (mesmo padrão do
Club Igreja e do Stokys).

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build normalmente.
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`
