---
project: Restaurante-Mobile
purpose: Aplicativo mobile de restaurante com API Laravel + Expo TS - cardápio, mesas, comandas do garçom e painel da cozinha
ai_parseable: true
tags: [laravel, php, expo, typescript, crud, rest-api, storage, service-layer, react-query, axios, react-hook-form, zod, mesas, comandas, cozinha]
created: 2026-09-20
updated: 2026-10-20
stack_backend: Laravel 13.32.0 (composer ^13.17) + PHP 8.3+ (runtime local atual 8.3.33; Codespaces registrado 8.4.15) + Sanctum 4.3.3 + SQLite (dev) + PHPUnit 12.5.35
stack_frontend: Expo SDK 57.0.30 + Expo Router 57.0.28 + expo-image-picker 57.0.20 + React 19.2.3 + React Native 0.86.3 + TypeScript 6.0.3 + React Query 5.104.4 + Axios 1.20.0 + React Hook Form 7.90.0 + Zod 4.6.7
status: backend_cardapio_garcom_cozinha_conta_done_frontend_3_tabs_tests_green
---

# CONTEXTO PARA IA - Como o projeto foi constituído até agora

Este documento é otimizado para leitura e filtragem por Agentes de IA. Use os cabeçalhos como âncoras e os `file_path:line` para navegação.

## 1. Timeline de constituição

1. **Ambiente** projeto iniciado em `C:\Users\SONY VAIO\OneDrive\Documentos\vscode\Restaurante-Mobile`, hoje versionado em `/workspaces/Aplicativo-Mobile-Restaurante` (Codespaces/Linux). PHP 8.3+ exigido pelo `composer.json` (`^8.3`); runtime local verificado **8.3.33** (Codespaces registrado em **8.4.15**). Habilitados `zip, openssl, fileinfo, mbstring, pdo_sqlite, curl`. Atenção: **GD não está disponível** no runtime do Codespaces (afeta `UploadedFile::fake()->image()`).
2. **Laravel** `composer create-project laravel/laravel backend` -> `laravel/framework v13.32.0`, `php artisan key:generate`, `php artisan migrate` (users/cache/jobs), `php artisan install:api` (Sanctum), `php artisan storage:link`.
3. **Entidade Produto** escolhida para restaurante (cobre todos os tipos exigidos). `php artisan make:model Produto -m` gerou `app/Models/Produto.php:1` e `database/migrations/2026_09_20_173920_create_produtos_table.php:1`.
4. **Camada OO** criada: `app/Services/ProdutoService.php:1` (Service), `app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1`, `app/Http/Resources/ProdutoResource.php:1`, `app/Http/Controllers/Api/ProdutoController.php:1`.
5. **Roteamento** `routes/api.php:1` com `apiResource`, registrado em `bootstrap/app.php:11` via `api: __DIR__.'/../routes/api.php'`. `config/cors.php:18` liberado para `api/*` e `storage/*`.
6. **Persistência** `php artisan make:factory ProdutoFactory`, `php artisan make:seeder ProdutoSeeder`, `database/seeders/DatabaseSeeder.php:1` chama `ProdutoSeeder`, seed 10 registros.
7. **Testes** `tests/Feature/ProdutoApiTest.php:1` com `RefreshDatabase` + `Storage::fake` + CRUD + validação.
8. **Frontend (inicial)** `npx create-expo-app frontend --template blank-typescript` -> `frontend/package.json:1`, `frontend/App.tsx` reescrito para CRUD, `frontend/.env.example:1`. (Posteriormente substituído pela estrutura feature-driven com Expo Router.)
9. **Verificação** `Invoke-RestMethod http://127.0.0.1:8001/api/produtos` retornou paginação `data/links/meta`, `GET /api/health` ok.
10. **Comentários** reescritos de pessoa-para-pessoa em 2ª pessoa (você), sem uso de 3ª pessoa. `backend/GUIA_CONTINUIDADE.md:1` reescrito no mesmo tom.
11. **Continuação (2026-10-17)** os 4 atributos pendentes foram implementados: migration `database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1`, `descricao`, `quantidade_estoque`, `data_validade`, `categoria` liberados em Model/Requests/Resource/Factory e no frontend.
12. **Correções (2026-10-17)** `destroy` retorna `204` sem corpo (`response()->noContent()`), paginação aceita `per_page` (1..100) no backend e o frontend percorre todas as páginas, exclusão com `try/catch` (no antigo `App.tsx`, antes da reestruturação). Symlink `public/storage -> storage/app/public` recriado.
13. **Reestruturação feature-driven (2026-10-17)** frontend migrado para **Expo Router** (`expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`), entry `expo-router/entry`, rotas em `src/app/` e código por funcionalidade em `src/features/produtos/` + `src/shared/`. Removidos `App.tsx`, `index.ts`, `src/services/` e `src/types/`. Resolvido conflito de peer deps (`react-dom` fixado em `19.2.3`, `expo-font` em `~57.0.4`). `expo-doctor` 21/21 e `tsc` OK.
14. **Inserção/exclusão robustas (2026-10-17)** `ProdutoForm` ganhou `expo-image-picker` (selecionar/trocar foto com preview); `updateProduto` passou a enviar multipart com `_method=PUT` (foto também na edição); `ProdutosScreen` recarrega com `useFocusEffect` e confirma exclusão; `ProdutoFormScreen` mostra aviso de sucesso. Multipart `_method=PUT` validado via curl; `tsc`, `expo-doctor` 21/21 e `expo export` OK.
15. **Correção de exclusão/feedback no web (2026-10-18)** o `Alert` do `react-native-web` é um no-op, então a confirmação de exclusão nunca chamava `remove()`. A exclusão agora usa o modal próprio `src/shared/components/ModalConfirmacao.tsx` (funciona em web e nativo). Criado `src/shared/utils/dialogos.ts` com `alerta()` (web: `window.alert`; nativo: `Alert`) — superado pelo item 17.
16. **Cadastro orientado a cardápio (2026-10-18)** entidade passou de estoque para cardápio: migration `database/migrations/2026_10_18_000000_add_campos_cardapio_to_produtos_table.php:1` adicionou `preco_promocional`, `ingredientes`, `alergenicos`, `porcao`, `disponivel`, `promocao_fim` e removeu `quantidade_estoque`/`data_validade`. Model/Requests/Resource/Factory/tests e frontend atualizados; `migrate:fresh --seed` e `php artisan test --filter=ProdutoApiTest` (4 passed) OK.
17. **Feedback in-app e URL de foto (2026-10-18)** avisos deixaram de usar `window.alert` no web: `src/shared/components/AvisoProvider.tsx` (montado no `src/app/_layout.tsx`) registra um handler e renderiza `src/shared/components/ModalAviso.tsx`; `src/shared/utils/dialogos.ts` apenas delega a esse handler, mantendo a API `alerta()`. A foto passou a ser exibida por `urlFoto(foto_path)` (origem da API + `/storage/`) em `ProdutoCard.tsx` e `ProdutoFormScreen.tsx`, porque o `foto_url` do backend usa `APP_URL=http://localhost:8000` e não carregava no Codespace/emulador. `tsc` e `expo export --platform web` OK.
18. **Sistema do garçom (2026-10-19)** novas entidades `Mesa`, `Pedido` e `PedidoItem` com migrations `2026_10_19_000001_create_mesas_table.php:1`, `..._000002_create_pedidos_table.php:1`, `..._000003_create_pedido_itens_table.php:1`. Criados `MesaService`/`PedidoService`, controllers, FormRequests, Resources, factories, `MesaSeeder` e `RegraNegocioException` (409 para regra de negócio). Fluxo: abrir comanda de uma mesa, lançar itens, enviar para a cozinha e acompanhar `aberto -> em_preparo -> pronto -> entregue`; `cancelado` também libera a mesa. Uma comanda ativa por mesa; itens só podem ser alterados enquanto `aberto`; o item guarda snapshot de nome/preço (`Produto::precoVigente()`). Regra de liberação da mesa e nova rodada substituídas pelo item 25.
19. **Painel da cozinha (2026-10-19)** migration `2026_10_19_000004_add_tempos_da_cozinha_to_pedidos_table.php:1` adicionou `enviado_em` e `pronto_em`. `CozinhaController::fila` expõe `GET /api/cozinha/fila?status=em_preparo|pronto`, ordenando as mais antigas primeiro. O painel da cozinha expõe apenas o avanço `em_preparo -> pronto`; entrega e cancelamento seguem no garçom. Cobertura com `CozinhaApiTest` (6 casos).
20. **Frontend em três abas (2026-10-19)** `src/app/(tabs)/` com **Mesas** (`index` -> `MesasScreen`), **Cozinha** (`cozinha` -> `CozinhaScreen`) e **Cardápio** (`cardapio` -> `ProdutosScreen`). Criadas as features `src/features/garcom/` e `src/features/cozinha/`, rotas finas para `mesa/nova`, `mesa/[id]` e `mesa/editar/[id]`. O layout raiz passou a montar `QueryClientProvider` (React Query) e `AvisoProvider`.
21. **Camada de dados e formulários (2026-10-19/20)** axios centralizado em `src/shared/lib/http.ts` (`API_URL`, `urlFoto`, `mensagemErro`, `resolverApiUrl`), com detecção do Codespaces na web (troca a porta 8081 do Expo pela 8000 do Laravel). Hooks migrados para React Query (`produtos`, `mesas`, `pedidos`, `cozinha`) com invalidação entre telas; formulários de produto e mesa usam React Hook Form + Zod; tema claro/escuro em `src/shared/theme/`; `SeletorFoto` isolado no formulário de produto.
22. **Refinamentos do cardápio (2026-10-19)** `GET /api/produtos` aceita `search` (nome/descrição), `categoria` e `order` (prefixo `-` = desc); `GET /api/produtos/categorias` lista categorias cadastradas. `PUT/PATCH` é parcial, aceita `remover_foto=true` e normaliza strings vazias para `null` via trait `NormalizaCamposVazios`. Testes de Produto ampliados para 12 casos.
23. **Correção da rota raiz (2026-10-20)** removido o `src/app/index.tsx` legado que reexportava `ProdutosScreen` e disputava `/` com `src/app/(tabs)/index.tsx`. A rota `/` agora abre a aba **Mesas**; `/cozinha` e `/cardapio` seguem funcionando. As rotas permanecem finas e as features em `src/features/` não foram alteradas. Validado com `tsc --noEmit` e Expo Web.
24. **Resolução automática da API (2026-10-20)** `resolverApiUrl` em `src/shared/lib/http.ts` passou a priorizar `EXPO_PUBLIC_API_URL` e, sem override, derivar o host do Expo Go via `Constants.expoConfig.hostUri` (porta 8000) ou do navegador na web (localhost/LAN na porta 8000, Codespaces com troca `-8081.` -> `-8000.`). Removido o `frontend/.env` com `localhost` fixo; `frontend/.env.example` ficou com as opções comentadas. Isso corrige o Expo Go em LAN sem afetar a Web e mantém override para produção/túnel. Validado com `tsc --noEmit`, Expo Web em `localhost` e via LAN, manifesto Android com `hostUri=192.168.0.11:8081` e `expo export --platform web`.
25. **Fechamento de conta e nova rodada (2026-10-20)** `entregue` deixou de liberar a mesa; novo status `fechado` encerra a conta e libera a mesa. Migrations `2026_10_20_000001_add_status_to_pedido_itens_table.php:1` e `2026_10_20_000002_add_fechamento_to_pedidos_table.php:1` adicionaram status por item e `fechado_em` (pedidos antigos `entregue` viraram `fechado`). Após a entrega, o garçom pode lançar uma nova rodada; o pedido volta para `aberto` e a cozinha recebe apenas os itens novos. Itens entregues não são editáveis. `PATCH /api/pedidos/{id}/status` aceita `fechado`. Testes backend em 44 casos naquela entrega e `tsc --noEmit` OK.
26. **Transições idempotentes (2026-10-21)** `PedidoService::alterarStatus()` passou a retornar a comanda atual quando o status solicitado é igual ao atual, sem alterar itens ou timestamps. Isso corrige o erro `pronto -> pronto` causado por tela defasada ou toque duplo após a cozinha marcar a nova rodada como pronta. Transições inválidas reais continuam retornando `409`. Novo teste em `PedidoApiTest`; total em **45 casos**.

## 2. Mapa de diretórios

```
backend/
  app/Models/Produto.php:1               # cardápio + fillable/casts + foto_url + precoVigente()
  app/Models/Mesa.php:1                  # mesa + status calculado + pedidoAtivo()
  app/Models/Pedido.php:1                # comanda + STATUS_* + TRANSICOES
  app/Models/PedidoItem.php:1            # item com snapshot de produto_nome/preco
  app/Services/ProdutoService.php:1      # filtros, upload, update parcial, remoção de foto
  app/Services/MesaService.php:1         # mesas, status livre/ocupada, bloqueio de exclusão
  app/Services/PedidoService.php:1       # comandas, itens, total, status, fila da cozinha
  app/Http/Controllers/Api/ProdutoController.php:1
  app/Http/Controllers/Api/MesaController.php:1
  app/Http/Controllers/Api/PedidoController.php:1
  app/Http/Controllers/Api/PedidoItemController.php:1
  app/Http/Controllers/Api/CozinhaController.php:1
  app/Http/Requests/StoreProdutoRequest.php:1
  app/Http/Requests/UpdateProdutoRequest.php:1
  app/Http/Requests/StoreMesaRequest.php:1
  app/Http/Requests/UpdateMesaRequest.php:1
  app/Http/Requests/StorePedidoRequest.php:1
  app/Http/Requests/AtualizarStatusPedidoRequest.php:1
  app/Http/Requests/StorePedidoItemRequest.php:1
  app/Http/Requests/UpdatePedidoItemRequest.php:1
  app/Http/Requests/Concerns/NormalizaCamposVazios.php:1
  app/Http/Resources/ProdutoResource.php:1
  app/Http/Resources/MesaResource.php:1
  app/Http/Resources/PedidoResource.php:1
  app/Http/Resources/PedidoItemResource.php:1
  app/Exceptions/RegraNegocioException.php:1 # erro de regra em JSON (409 por padrão)
  bootstrap/app.php:11                   # withRouting api
  routes/api.php:1                       # produtos, mesas, pedidos, itens, cozinha, health
  config/cors.php:18                     # paths api/*, storage/*, allowed_origins *
  config/filesystems.php:1               # disk public -> storage/app/public
  database/migrations/
    2026_09_20_173920_create_produtos_table.php:1      # base (nome, preco, foto_path)
    2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1
    2026_10_18_000000_add_campos_cardapio_to_produtos_table.php:1
    2026_10_19_000001_create_mesas_table.php:1
    2026_10_19_000002_create_pedidos_table.php:1
    2026_10_19_000003_create_pedido_itens_table.php:1
    2026_10_19_000004_add_tempos_da_cozinha_to_pedidos_table.php:1
    2026_10_20_000001_add_status_to_pedido_itens_table.php:1
    2026_10_20_000002_add_fechamento_to_pedidos_table.php:1
  database/factories/ProdutoFactory.php:1
  database/factories/MesaFactory.php:1
  database/factories/PedidoFactory.php:1
  database/factories/PedidoItemFactory.php:1
  database/seeders/DatabaseSeeder.php:1  # User + ProdutoSeeder + MesaSeeder
  database/seeders/ProdutoSeeder.php:1   # 7 normais + 3 em promoção
  database/seeders/MesaSeeder.php:1      # 12 mesas
  tests/Feature/ProdutoApiTest.php:1
  tests/Feature/MesaApiTest.php:1
  tests/Feature/PedidoApiTest.php:1
  tests/Feature/CozinhaApiTest.php:1
  storage/app/public/produtos/           # destino da foto; public/storage é symlink

frontend/
  app.json:1                             # Expo config + scheme + expo-router/image-picker
  package.json:1                         # expo-router/entry; React Query, axios, RHF, zod
  tsconfig.json:1                        # alias @/* -> ./src/*
  src/
    app/
      _layout.tsx:1                      # QueryClientProvider + AvisoProvider + Stack
      (tabs)/_layout.tsx:1               # abas Mesas, Cozinha, Cardápio
      (tabs)/index.tsx:1                 # -> MesasScreen
      (tabs)/cozinha.tsx:1               # -> CozinhaScreen
      (tabs)/cardapio.tsx:1              # -> ProdutosScreen
      produto/novo.tsx:1                 # -> ProdutoFormScreen (create)
      produto/[id].tsx:1                 # -> ProdutoFormScreen (edit)
      mesa/nova.tsx:1                    # -> MesaFormScreen (create)
      mesa/editar/[id].tsx:1             # -> MesaFormScreen (edit)
      mesa/[id].tsx:1                    # -> ComandaScreen
    features/produtos/
      constants.ts:1                     # CATEGORIAS e ALERGENICOS
      schemas/produtoSchema.ts:1         # validação Zod do formulário
      components/ProdutoCard.tsx:1
      components/ProdutoForm.tsx:1       # RHF + Zod + foto
      components/SeletorFoto.tsx:1       # galeria/preview/remoção visual
      hooks/useProdutos.ts:1             # React Query: lista, detalhe, salvar, excluir
      services/produtosApi.ts:1          # CRUD multipart/paginação + re-export do http
      types/Produto.ts:1
      screens/ProdutosScreen.tsx:1
      screens/ProdutoFormScreen.tsx:1
    features/garcom/
      constants.ts:1                     # rótulos/descrições/cores dos status
      schemas/mesaSchema.ts:1            # validação Zod da mesa
      components/MesaCard.tsx:1
      components/MesaForm.tsx:1
      components/LinhaItemComanda.tsx:1
      components/ModalItemComanda.tsx:1
      components/ModalSeletorProduto.tsx:1
      components/StatusBadge.tsx:1
      hooks/useMesas.ts:1
      hooks/useComanda.ts:1
      services/garcomApi.ts:1            # mesas + comandas + itens + status
      types/Mesa.ts:1
      types/Pedido.ts:1
      screens/MesasScreen.tsx:1
      screens/MesaFormScreen.tsx:1
      screens/ComandaScreen.tsx:1
    features/cozinha/
      constants.ts:1                     # faixas de urgência (10/20 min)
      components/CardComandaCozinha.tsx:1
      hooks/useCozinha.ts:1              # polling de 10s + marcar pronto
      services/cozinhaApi.ts:1
      screens/CozinhaScreen.tsx:1
    shared/
      components/Botao.tsx:1
      components/Campo.tsx:1
      components/ModalConfirmacao.tsx:1
      components/ModalAviso.tsx:1
      components/AvisoProvider.tsx:1
      components/SeletorChips.tsx:1
      lib/http.ts:1                      # axios, resolução automática de API_URL, urlFoto, mensagemErro
      lib/queryClient.ts:1
      theme/colors.ts:1                  # paletas clara/escura + tokens
      theme/useTheme.ts:1
      theme/index.ts:1
      utils/dialogos.ts:1                # alerta() -> AvisoProvider
      utils/format.ts:1                  # preço, data, tempo/minutos decorridos
```

## 3. Modelo de dados atual

**Tabela `produtos` (cardápio):**
- `id` bigint PK
- `nome` string(150) required
- `preco` decimal(10,2) required
- `preco_promocional` decimal(10,2) nullable
- `foto_path` string nullable (caminho relativo `produtos/xxx.jpg`)
- `descricao` text nullable
- `ingredientes` text nullable
- `alergenicos` string(255) nullable (lista separada por vírgula)
- `porcao` integer nullable (quantas pessoas a porção serve)
- `disponivel` boolean default true
- `promocao_fim` date nullable
- `categoria` string(80) nullable (lista fixa)
- `created_at`, `updated_at` timestamps

**Model `Produto.php`:**
```php
CATEGORIAS = [Entrada, Prato Principal, Sobremesa, Bebida, Acompanhamento]
fillable = [nome, preco, preco_promocional, foto_path, descricao, ingredientes, alergenicos, porcao, disponivel, promocao_fim, categoria]
casts = [preco => decimal:2, preco_promocional => decimal:2, porcao => integer, disponivel => boolean, promocao_fim => date]
attributes = [disponivel => true]
getFotoUrlAttribute() => asset('storage/'.$foto_path)
precoVigente() => promocional se válido e não vencido; senão preco
HasFactory
```

**Tabela `mesas`:**
- `id` bigint PK
- `numero` unsignedInteger unique
- `capacidade` unsignedInteger nullable
- `ativa` boolean default true
- `created_at`, `updated_at`
- status **não é coluna**: calculado como `livre`/`ocupada` a partir da existência de comanda ativa.

**Tabela `pedidos` (comandas):**
- `id` bigint PK
- `mesa_id` FK -> `mesas` (cascadeOnDelete)
- `status` string `aberto|em_preparo|pronto|entregue|fechado|cancelado` (default `aberto`)
- `observacao` text nullable
- `total` decimal(10,2) default 0 (recalculado a cada mudança de item)
- `enviado_em` timestamp nullable (entrada na cozinha)
- `pronto_em` timestamp nullable (cozinha terminou)
- `fechado_em` timestamp nullable (conta encerrada)
- `created_at`, `updated_at`
- índice `[mesa_id, status]`

**Tabela `pedido_itens`:**
- `id` bigint PK
- `pedido_id` FK -> `pedidos` (cascadeOnDelete)
- `produto_id` FK -> `produtos` nullable (`nullOnDelete`)
- `produto_nome` string(150) — snapshot
- `quantidade` unsignedInteger
- `preco_unitario` decimal(10,2) — snapshot do preço vigente
- `observacao` string(255) nullable
- `status` string `pendente|em_preparo|pronto|entregue|cancelado` (default `pendente`)
- `created_at`, `updated_at`
- índice `[pedido_id, status]`

**Estados e regras (`app/Models/Pedido.php:1`):**
```php
STATUS_ABERTO / EM_PREPARO / PRONTO / ENTREGUE / FECHADO / CANCELADO
STATUS_ATIVOS = [aberto, em_preparo, pronto, entregue]  # ocupam a mesa
TRANSICOES = [
  aberto => [em_preparo, cancelado],
  em_preparo => [pronto, cancelado],
  pronto => [entregue, cancelado],
  entregue => [fechado],
  fechado => [],
  cancelado => [],
]
```
`fechado` e `cancelado` liberam a mesa; `entregue` mantém a mesa ocupada até o fechamento da conta. Os itens têm status independente para permitir nova rodada sem reenviar itens já entregues à cozinha.

## 4. Arquitetura backend - decisões para IA

- **Service Layer** mantém Controllers magros.
- **ProdutoService::listAll(array $filters, int $perPage = 15)** aplica `search` (LIKE em `nome`/`descricao`), `categoria` e `order`. `order` aceita prefixo `-` para descendente; valor inválido cai em `created_at desc`. A whitelist `COLUNAS_ORDENAVEIS` aceita `nome`, `preco`, `categoria`, `created_at`, `updated_at`.
- **ProdutoService::categorias()** retorna categorias distintas já cadastradas (alimenta o filtro; não é `Produto::CATEGORIAS`).
- **ProdutoService::create/update/delete** tratam upload no disco `public` (`produtos/`), atualização parcial, troca de foto (grava a nova antes de apagar a antiga), `remover_foto=true` e limpeza de arquivo órfão.
- **MesaService::listAll(filters, perPage=50)** filtra `status=livre|ocupada` e `ativa=1|0`, ordena por `numero` e inclui `pedidoAtivo` com contagem de itens. `find` inclui a comanda ativa e seus itens. `delete` lança `RegraNegocioException` se houver comanda ativa.
- **PedidoService::listAll(filters, perPage=15)** filtra `status` e `mesa_id`, inclui `mesa:id,numero` e `itens`.
- **PedidoService::abrir(Mesa, data)** exige mesa ativa e sem comanda ativa. **adicionarItem** aceita `aberto` ou `entregue`; após `entregue`, reabre a comanda para `aberto`, limpa `enviado_em`/`pronto_em`, grava o item como `pendente`, mantém snapshot (`produto_nome`, `preco_unitario = Produto::precoVigente()`) e recalcula `total`. **atualizarItem/removerItem** exigem comanda `aberto` e item `pendente`; ao remover o último pendente de uma conta reaberta, o pedido volta para `entregue`. **enviarParaCozinha** exige `aberto` + item pendente, marca somente os pendentes como `em_preparo` e grava `enviado_em`. **alterarStatus** valida `TRANSICOES`, atualiza os itens em lote, grava `pronto_em` ao ficar `pronto`, grava `fechado_em` ao fechar e bloqueia cancelamento se houver item entregue. Repetir o status atual é idempotente: retorna a comanda sem alterar itens/timestamps.
- **PedidoService::filaCozinha(status, perPage=15)** aceita `em_preparo` (ordena por `enviado_em`) ou `pronto` (ordena por `pronto_em`), sempre com `id` como desempate. A consulta inclui apenas pedidos/itens no status da fila, então rodadas antigas já entregues não reaparecem.
- **FormRequests** autorizam `true` (rotas públicas). Produto usa as regras do cardápio; Mesa valida `numero` único (1..999) e `capacidade` (1..99); Pedido exige `mesa_id` existente e `observacao` até 500; Item exige `produto_id` existente e `quantidade` 1..99; status aceita `em_preparo|pronto|entregue|fechado|cancelado`.
- **NormalizaCamposVazios** (trait) converte `''`/espaços em `null` apenas nos campos enviados, preservando update parcial. Usado em Produto, Mesa, Pedido e Item.
- **Resources**:
  - `ProdutoResource`: todos os campos do cardápio + `foto_url` + timestamps ISO8601; `promocao_fim` em `Y-m-d`.
  - `MesaResource`: `id, numero, capacidade, ativa, status, pedido_ativo` (id, status, total, itens_count, aberto_em) + timestamps.
  - `PedidoResource`: `id, mesa_id, mesa{id,numero}, status, observacao, total, itens, criado_em, enviado_em, pronto_em, fechado_em, atualizado_em`.
  - `PedidoItemResource`: `id, pedido_id, produto_id, produto_nome, quantidade, preco_unitario, subtotal, observacao, status` + timestamps.
- **Controllers** usam Route Model Binding. `index` limita `per_page` entre 1 e 100 (default 15; mesas default 50). `store` -> `201`; `destroy` -> `204`. `RegraNegocioException` renderiza JSON com status (409 padrão, 404 quando informado).
- **Storage** disco `public`, `php artisan storage:link` cria `public/storage -> storage/app/public`. Se `public/storage` virar diretório comum, apague e rode `php artisan storage:link`. No app, a imagem é montada por `urlFoto(foto_path)`, então `APP_URL` não afeta a exibição.
- **CORS** `config/cors.php:18` cobre `api/*`, `sanctum/csrf-cookie` e `storage/*`, com `allowed_origins *`.
- **Autenticação** Sanctum instalado, mas todas as rotas são públicas (`authorize()` sempre `true`) — ponto a evoluir.

## 5. Contrato API

Base `http://localhost:8000/api` (ou `http://10.0.2.2:8000/api` no emulador Android)

### Produtos
- `GET /produtos?page=1&per_page=15&search=&categoria=&order=` -> coleção paginada com `data`, `links`, `meta`; `order` aceita `nome`, `preco`, `categoria`, `created_at`, `updated_at` e prefixo `-` para desc.
- `GET /produtos/categorias` -> `{data:[...]}` com categorias já cadastradas.
- `POST /produtos` multipart `nome, preco, preco_promocional?, descricao?, ingredientes?, alergenicos?, porcao?, disponivel?, promocao_fim?, categoria?, foto?` -> `201 {data:{...}}`; `422` validação.
- `GET /produtos/{id}` -> `200 {data:{...}}`; `404` se não existe.
- `PUT/PATCH /produtos/{id}` JSON ou multipart, campos parciais + `foto?` + `remover_foto?` -> `200`.
- `DELETE /produtos/{id}` -> `204` sem corpo.

### Mesas
- `GET /mesas?status=livre|ocupada&ativa=1|0&page=&per_page=` -> paginado; cada mesa traz `status` calculado e `pedido_ativo`.
- `POST /mesas` `{numero, capacidade?, ativa?}` -> `201`.
- `GET /mesas/{id}` -> `200` com comanda ativa e itens.
- `PUT/PATCH /mesas/{id}` parcial -> `200`.
- `DELETE /mesas/{id}` -> `204`; `409` se houver comanda ativa.

### Comandas
- `POST /pedidos` `{mesa_id, observacao?}` -> `201` (abre comanda; `409` se mesa inativa/ocupada).
- `GET /pedidos?status=&mesa_id=&page=&per_page=` -> paginado com itens.
- `GET /pedidos/{id}` -> `200` com itens.
- `POST /pedidos/{id}/itens` `{produto_id, quantidade, observacao?}` -> `201`.
- `PUT /pedidos/{id}/itens/{item}` `{quantidade?, observacao?}` -> `200`.
- `DELETE /pedidos/{id}/itens/{item}` -> `204`.
- `POST /pedidos/{id}/enviar` -> `200` (`409` sem itens ou fora de `aberto`).
- `PATCH /pedidos/{id}/status` `{status}` com `em_preparo|pronto|entregue|fechado|cancelado` -> `200`; transição inválida -> `409`.

### Cozinha e saúde
- `GET /cozinha/fila?status=em_preparo|pronto&page=&per_page=` -> fila paginada (default `em_preparo`); status inválido -> `422`.
- `GET /health` -> `{status: ok}`.

Exemplos:
```bash
curl "http://localhost:8000/api/produtos?per_page=100"
curl "http://localhost:8000/api/produtos?search=moqueca&categoria=Prato%20Principal&order=-preco"
curl "http://localhost:8000/api/produtos/categorias"
curl "http://localhost:8000/api/mesas?status=livre"
curl -X POST "http://localhost:8000/api/pedidos" -H "Content-Type: application/json" -d "{\"mesa_id\":1}"
curl -X POST "http://localhost:8000/api/pedidos/1/itens" -H "Content-Type: application/json" -d "{\"produto_id\":1,\"quantidade\":2}"
curl -X POST "http://localhost:8000/api/pedidos/1/enviar"
curl "http://localhost:8000/api/cozinha/fila"
curl -X PATCH "http://localhost:8000/api/pedidos/1/status" -H "Content-Type: application/json" -d "{\"status\":\"pronto\"}"
```

## 6. Frontend - feature-driven (Expo Router + React Query)

- **Arquitetura por funcionalidade**: rotas em `src/app/` (finas, só reexportam `screens/`), lógica por feature em `src/features/<nome>/`, código genérico em `src/shared/`. Alias `@/*` -> `src/*` (`tsconfig.json:6`).
- **Expo Router** com `main: expo-router/entry`; `app.json` tem `scheme: restaurantemobile`, plugin `expo-router`, `expo-image-picker` e `experiments.typedRoutes`.
- **Raiz**: `src/app/_layout.tsx:1` monta `QueryClientProvider`, `AvisoProvider`, `Stack` (títulos das rotas) e `StatusBar`. `queryClient` em `src/shared/lib/queryClient.ts:1`.
- **Abas** (`src/app/(tabs)/_layout.tsx:1`): `Mesas` (index, inicial), `Cozinha` e `Cardápio`. Rotas de detalhe/formulário ficam no Stack raiz.
- **Rota raiz**: `src/app/(tabs)/index.tsx:1` responde por `/` e abre a aba Mesas; não existe `src/app/index.tsx`.
- **HTTP** (`src/shared/lib/http.ts:1`):
  - `API_URL` = `EXPO_PUBLIC_API_URL` se definido. Sem override, no nativo usa o host de `Constants.expoConfig.hostUri` na porta 8000 (Expo Go LAN/emulador); na web usa `localhost`/IP privado na porta 8000 e reescreve `-8081.` para `-8000.` no Codespaces. Fallback: Android `10.0.2.2:8000`, iOS `localhost:8000`.
  - O `frontend/.env` local não é necessário; `frontend/.env.example` mantém as opções de override comentadas.
  - Instância axios `api` com `Accept: application/json` e timeout 20s.
  - `urlFoto(foto_path)` monta `${origem}/storage/${path}`.
  - `mensagemErro(erro)` extrai mensagem de validação do Laravel/axios.
- **Produtos**:
  - `services/produtosApi.ts` pagina todas as páginas (`per_page=100`) e faz `create/update/delete` multipart; update envia `_method=PUT` e foto real no web (`File`) ou `{uri,name,type}` no nativo. Reexporta `API_URL`, `urlFoto` e `mensagemErro`.
  - Hooks (`useProdutos`, `useProduto`, `useSalvarProduto`, `useExcluirProduto`) usam React Query; mutações invalidam `['produtos']`.
  - `ProdutoForm` usa React Hook Form + Zod, chips de categoria/alergênicos, `Switch` de disponibilidade, `SeletorFoto`.
  - `ProdutosScreen` usa `FlatList`, `useFocusEffect` para refetch, pull-to-refresh e `ModalConfirmacao` para excluir.
  - `ProdutoFormScreen` detecta `id`, busca detalhe, cria/edita e mostra `alerta` de sucesso antes de voltar.
- **Garçom**:
  - `garcomApi.ts` centraliza mesas e comandas; `listarTudo` percorre todas as páginas (`per_page=100`). Endpoints: mesas CRUD, abrir/listar/obter pedidos, itens, enviar e alterar status.
  - `useMesas` e `useComanda` usam React Query. Mutações de comanda invalidam `['mesas']`, `['pedidos']` e `['cozinha']`; exclusão de mesa mostra erro de regra no `alerta`.
  - `MesasScreen` exibe grade de mesas com resumo livre/ocupada, filtros e ações de abrir/editar; `MesaFormScreen` cria/edita/exclui mesa (validação Zod).
  - `ComandaScreen` carrega mesa + comanda ativa, permite abrir comanda, adicionar/editar/remover itens pendentes, enviar para cozinha, marcar pronto, entregar, adicionar nova rodada após `entregue` e fechar a conta. `entregue` mantém a mesa ocupada; `fechado`/`cancelado` encerram. Usa `ModalSeletorProduto`, `ModalItemComanda`, `ModalConfirmacao`, `StatusBadge` e `LinhaItemComanda`.
- **Cozinha**:
  - `useFilaCozinha(status)` usa React Query com `refetchInterval` de **10s**; `useMarcarPronto` invalida `['cozinha']`, `['mesas']` e `['pedidos']`.
  - `CozinhaScreen` usa `SectionList` com seções “Em preparo” e “Prontas aguardando retirada”, botão/pull-to-refresh e recarga ao focar.
  - `CardComandaCozinha` mostra mesa, tempo decorrido, itens, observações e urgência (verde até 10 min, âmbar 10–20, vermelho acima de 20).
- **Shared**:
  - Componentes: `Botao` (primary/secondary/danger/loading), `Campo`, `ModalConfirmacao`, `ModalAviso`, `AvisoProvider`, `SeletorChips`.
  - Tema claro/escuro em `src/shared/theme/` com tokens `cores`, `radius`, `spacing`; telas usam `useTheme`.
  - `utils/dialogos.ts` expõe `alerta()` que delega ao `AvisoProvider` (fallback nativo via `Alert`); nenhum uso de `window.alert`.
  - `utils/format.ts`: `formatarPreco`, `formatarData`, `tempoDecorrido`, `minutosDecorridos`.

## 7. Testes e seeds

- **ProdutoFactory**: nome, preço 5–200, campos do cardápio, `disponivel` 80%, categoria aleatória; estado `emPromocao($fim)` aplica 20% de desconto.
- **MesaFactory**: número único, capacidade 2/4/6/8, ativa.
- **PedidoFactory**: mesa factory, status `aberto`, total 0; estados `emPreparo($min)` e `pronto($min)` ajustam `enviado_em`/`pronto_em`; `entregue()` e `fechado()` cobrem os status finais.
- **PedidoItemFactory**: pedido/produto factory, snapshot de nome/preço, quantidade 1–3, status inicial `pendente`.
- **ProdutoSeeder**: 10 produtos (7 normais + 3 em promoção vigente). **MesaSeeder**: 12 mesas. **DatabaseSeeder**: usuário de teste + os dois seeders.
- **ProdutoApiTest** (12 casos): CRUD com foto, campos base, validações, busca/categoria/ordenação, categorias, update parcial, troca/remoção de foto, normalização de vazios, exclusão de registro/foto.
- **MesaApiTest** (8 casos): CRUD, número único, validação, status/pedido ativo, filtro por status, mesa ocupada após entrega e liberada ao fechar/cancelar, bloqueio de exclusão com comanda ativa, 404.
- **PedidoApiTest** (17 casos): abrir comanda/itens, editar/remover/recalcular total, uma comanda por mesa, mesa inativa/inexistente, envio para cozinha, fluxo de status até fechar a conta, nova rodada após entrega, transições idempotentes, bloqueios de fechamento/cancelamento, snapshot, preço promocional, item de outra comanda, validação e filtros.
- **CozinhaApiTest** (6 casos): fila em preparo ordenada, prontas, status inválido, marcar pronto, bloqueio de retorno para preparo, fluxo completo até fechar a conta.
- Examples: 1 Feature + 1 Unit. Total atual: **45 casos**.
- Os testes usam `RefreshDatabase`; uploads usam `Storage::fake('public')` e PNG gerado por `createWithContent` (não dependem de GD).

Rodar: `php artisan migrate:fresh --seed && php artisan test`. Lint: `vendor/bin/pint --test` (quando `vendor/` estiver instalado).

## 8. Como estender (próximos passos possíveis)

1. **Auth**: aplicar `auth:sanctum` nas rotas e criar login por token; no frontend, `src/features/auth/` + rota `src/app/(auth)/login.tsx`.
2. **Remover foto na UI**: o backend já aceita `remover_foto=true`; falta botão explícito na edição do produto.
3. **Paginação na UI**: usar `onEndReached` em vez de carregar todas as páginas no cardápio/mesas/comandas.
4. **Garçom**: divisão por pessoa, fechamento de conta com pagamento/impressão e cancelamento de rodada específica.
5. **Cozinha**: alerta sonoro/visual de comanda nova, filtro por categoria e impressão da comanda.
6. **Qualidade**: CI com `php artisan test`, `pint --test`, `tsc --noEmit` e `expo-doctor`.

## 9. Convenções para IA filtrar

- Campos do cardápio: `nome`, `preco`, `preco_promocional`, `foto_path`, `descricao`, `ingredientes`, `alergenicos`, `porcao`, `disponivel`, `promocao_fim`, `categoria`. Campos antigos `quantidade_estoque` e `data_validade` foram removidos.
- Comanda: status em `Pedido::TRANSICOES`; `STATUS_ATIVOS` ocupam a mesa; `fechado`/`cancelado` liberam. `entregue` mantém a mesa ocupada e permite nova rodada; itens só mudam quando o pedido está `aberto` e o item está `pendente`.
- Itens de comanda guardam **snapshot** (`produto_nome`, `preco_unitario`); `produto_id` pode virar `null` sem perder o histórico.
- **Frontend feature-driven**: rotas em `src/app/*` nunca contêm regra de negócio (só reexportam `screens/`); cada feature isola `components/hooks/services/types/screens` (e `schemas`/`constants` quando necessário); o que é genérico vai em `src/shared/`.
- **Dados no frontend** passam por React Query; ao criar/editar/remover, invalide as chaves relacionadas (`['produtos']`, `['mesas']`, `['pedidos']`, `['cozinha']`).
- Decimais do Laravel chegam como `string` no TypeScript (`preco`, `total`, `preco_unitario`, `subtotal`).
- `alerta()` é o único caminho para avisos; não usar `window.alert`/`Alert` diretamente nas telas.
- Comentários explicativos são normais; os marcadores antigos `// Oi,`/`// Você`/`// Quando você` não existem mais.
- `file_path:line` usado em docs para navegação direta.

## 10. Estado verificado

- Backend por contagem estática: **12 migrations**; 5 arquivos de Feature test (`ProdutoApiTest` 12, `MesaApiTest` 8, `PedidoApiTest` 17, `CozinhaApiTest` 6) + 2 Examples = **45 casos**.
- `GUIA_CONTINUIDADE.md` registra `migrate:fresh --seed` com 10 produtos e 12 mesas e suíte de testes verde na última execução; os seeders confirmam esses volumes.
- Contrato validado por curl no guia: CRUD de produtos com foto, filtros, `_method=PUT`, remoção de foto, mesas, abertura de comanda, itens, envio, fila da cozinha, nova rodada e transições de status até `fechado`.
- Frontend: `tsc`, `expo-doctor` 21/21 e `expo export` foram verificados antes da introdução de React Query/axios/RHF/Zod. Revalidado em 2026-10-20: `npx tsc --noEmit` e `npx expo export --platform web` passaram; `expo-doctor` permanece como verificação opcional.
- Symlink `public/storage` deve apontar para `storage/app/public`; recriar com `php artisan storage:link` se necessário.

---
Gerado para consumo por LLMs/Agentes: filtre por `ai_parseable: true` e tags.
