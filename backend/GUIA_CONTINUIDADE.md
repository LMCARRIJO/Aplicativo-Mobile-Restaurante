# Continuidade - cardápio e sistema do garçom prontos

Este backend representa o **cardápio de um restaurante** (pratos e bebidas) e o **sistema do garçom** (mesas e comandas), com camada OO e cobertura dos tipos exigidos (numbers, strings, dates, foto):

| Atributo | Tipo | Onde |
| --- | --- | --- |
| `nome` | string(150) | `app/Models/Produto.php` |
| `preco` | decimal(10,2) | `app/Models/Produto.php` |
| `preco_promocional` | decimal(10,2), opcional | migration de cardápio |
| `foto_path` / `foto_url` | foto (storage) | `app/Services/ProdutoService.php` |
| `descricao` | text | migration de complemento |
| `ingredientes` | text | migration de cardápio |
| `alergenicos` | string(255) (lista separada por vírgula) | migration de cardápio |
| `porcao` | integer (serve N pessoas) | migration de cardápio |
| `disponivel` | boolean (default true) | migration de cardápio |
| `promocao_fim` | date | migration de cardápio |
| `categoria` | string(80) (lista fixa) | migration de complemento |

Os campos de cardápio foram adicionados em `database/migrations/2026_10_18_000000_add_campos_cardapio_to_produtos_table.php:1`, que também removeu `quantidade_estoque` e `data_validade`. As categorias válidas ficam em `Produto::CATEGORIAS` (Entrada, Prato Principal, Sobremesa, Bebida, Acompanhamento).

## O que foi feito

1. Migration de cardápio com `preco_promocional`, `ingredientes`, `alergenicos`, `porcao`, `disponivel`, `promocao_fim` (e remoção de estoque/validade).
2. Model `app/Models/Produto.php:1`: campos no `$fillable`, `CATEGORIAS`, casts (`preco`/`preco_promocional` decimal, `porcao` integer, `disponivel` boolean, `promocao_fim` date) e default em memória `disponivel => true`.
3. Requests `app/Http/Requests/StoreProdutoRequest.php:1` e `UpdateProdutoRequest.php:1`: regras do cardápio (porção `1..99`, categoria via `Rule::in`, data de promoção, boolean de disponibilidade).
4. Resource `app/Http/Resources/ProdutoResource.php:1`: expõe todos os campos (`promocao_fim` em `Y-m-d`).
5. Factory `database/factories/ProdutoFactory.php:1`: gera dados falsos realistas do cardápio.
6. Frontend (estrutura feature-driven com Expo Router) com **CRUD completo**: tipos em `frontend/src/features/produtos/types/Produto.ts:1`, listas fixas em `.../constants.ts:1`, chamadas em `.../services/produtosApi.ts:1`, telas em `.../screens/`, componentes em `.../components/` e rotas em `frontend/src/app/`. Categoria e alergênicos usam chips (`SeletorChips`), disponibilidade usa `Switch`, inserção/edição com foto via `expo-image-picker`.

## Correções aplicadas junto

- `destroy` responde `204` **sem corpo** (`response()->noContent()`).
- `index` aceita `per_page` (1..100, default 15), `search` (LIKE em `nome`/`descricao`), `categoria` e `order` (whitelist em `ProdutoService::COLUNAS_ORDENAVEIS`, prefixo `-` = desc; valor inválido cai em `-created_at`). O frontend percorre todas as páginas.
- `GET /api/produtos/categorias` devolve `Produto::CATEGORIAS` (rota estática registrada antes do `apiResource`).
- Atualização é **parcial**: `PUT/PATCH` só mexe nos campos enviados. `remover_foto=true` apaga a foto atual; ao trocar a foto, a nova é gravada antes de apagar a antiga.
- `create`/`update` normalizam strings vazias (`''`/espaços) para `null` nos campos opcionais (trait `NormalizaCamposVazios`).
- A exclusão usa o modal próprio `frontend/src/shared/components/ModalConfirmacao.tsx` (confirmação dentro do app, sem `window.confirm`), funcionando em web e nativo.
- Diálogos informativos cross-platform em `frontend/src/shared/utils/dialogos.ts`: `alerta()` delega ao `AvisoProvider` (`frontend/src/shared/components/AvisoProvider.tsx`, montado no `_layout`), que abre o `ModalAviso` dentro do app. Não se usa mais `window.alert` no web.
- A foto é exibida via `urlFoto(foto_path)` (origem da `API_URL` + `/storage/`) no `ProdutoCard`/`ProdutoFormScreen`. O `foto_url` do backend depende de `APP_URL`, então `http://localhost:8000` não carrega no Codespace/emulador.
- Edição no app envia multipart com `_method=PUT`, permitindo trocar a foto.
- Symlink `public/storage` recriado (se ele virar pasta comum no clone, rode `php artisan storage:link`).

## Sistema do garçom (mesas e comandas)

Fluxo: o garçom abre a comanda de uma mesa, anota os itens e envia para a cozinha; depois acompanha `em_preparo` → `pronto` → `entregue`. `entregue` **mantém a mesa ocupada** até o garçom fechar a conta (`fechado`); só então (ou em `cancelado`) a mesa volta ao salão. Após entregar, o garçom pode lançar uma **nova rodada**: a comanda volta para `aberto` e apenas os itens novos seguem para a cozinha. O envio grava `enviado_em`, a cozinha grava `pronto_em` ao marcar pronto e o fechamento grava `fechado_em`.

| Tabela | Campos |
| --- | --- |
| `mesas` | `numero` (único), `capacidade`, `ativa` |
| `pedidos` | `mesa_id`, `status` (string), `observacao`, `total` (recalculado), `enviado_em`, `pronto_em`, `fechado_em` |
| `pedido_itens` | `pedido_id`, `produto_id` (nullable), `produto_nome`, `quantidade`, `preco_unitario`, `observacao`, `status` (`pendente`/`em_preparo`/`pronto`/`entregue`/`cancelado`) |

- Status em `app/Models/Pedido.php:1`: `STATUS_ABERTO`/`STATUS_ATIVOS` e `TRANSICOES` (a transição só acontece se estiver na lista). `STATUS_ATIVOS` inclui `entregue`; uma comanda ativa por mesa (`Mesa::pedidoAtivo()`), validado em `PedidoService::abrir()`.
- `pedido_itens` guarda **snapshot** de `produto_nome` e `preco_unitario` (preço vigente, ver `Produto::precoVigente()`), então a comanda continua legível se o prato mudar de preço ou sair do cardápio (`produto_id` fica `null` via `nullOnDelete`).
- Itens só podem ser incluídos com a comanda `aberto` ou `entregue` (nova rodada); alteração/remoção exige comanda `aberto` e item `pendente`. O envio manda apenas os itens `pendentes` e exige ao menos um.
- `app/Exceptions/RegraNegocioException.php:1` centraliza os erros de regra (409) com `render()` em JSON — não estoura 500.
- Frontend: `frontend/src/features/garcom/` (telas `MesasScreen`, `ComandaScreen`, `MesaFormScreen`) e as rotas em `frontend/src/app/(tabs)/index.tsx` (aba Mesas), `mesa/[id]`, `mesa/nova`, `mesa/editar/[id]`.

## Sistema da cozinha (painel)

Painel em `frontend/src/features/cozinha/` (aba **Cozinha**, `frontend/src/app/(tabs)/cozinha.tsx`) — não há regra nova no backend além da fila:

- `CozinhaController::fila` aceita `?status=em_preparo` (padrão) ou `?status=pronto` (aguardando retirada); outro valor responde 422. `PedidoService::filaCozinha($status)` ordena por `enviado_em` (ou `pronto_em`, quando `pronto`) e depois por `id` — mais antigas primeiro. A fila retorna apenas os itens da rodada atual, sem repetir itens já entregues.
- A cozinha só avança `em_preparo` → `pronto` (`PATCH /api/pedidos/{id}/status`); entregar, fechar a conta e cancelar continuam com o garçom (`TRANSICOES` em `app/Models/Pedido.php:1`).
- Tempo de espera no cartão: `enviado_em` para as em preparo, `pronto_em` para as prontas (`frontend/src/shared/utils/format.ts` → `tempoDecorrido`). Faixas de urgência em `features/cozinha/constants.ts`: verde até 10 min, âmbar de 10 a 20, vermelho acima de 20.
- Atualização: React Query com `refetchInterval` de 10s (`features/cozinha/hooks/useCozinha.ts`), recarga ao focar a aba e pull-to-refresh/botão "Atualizar". Ao marcar pronto, o hook invalida `['cozinha']`, `['mesas']` e `['pedidos']`, então o salão reflete na hora.
- Verificado com `CozinhaApiTest` (6 casos) + teste de ponta a ponta no navegador (fila → marcar pronto → prontas → mesa ainda ocupada).

## Como testar

```bash
php artisan migrate:fresh --seed
php artisan test
php artisan serve --host=0.0.0.0 --port=8000
curl "http://localhost:8000/api/produtos?per_page=100"
curl "http://localhost:8000/api/produtos?search=moqueca&categoria=Prato%20Principal&order=-preco"
curl "http://localhost:8000/api/produtos/categorias"
curl "http://localhost:8000/api/mesas"
curl -X POST "http://localhost:8000/api/pedidos" -H "Content-Type: application/json" -d "{\"mesa_id\":1}"
curl -X POST "http://localhost:8000/api/pedidos/1/itens" -H "Content-Type: application/json" -d "{\"produto_id\":1,\"quantidade\":2}"
curl -X POST "http://localhost:8000/api/pedidos/1/enviar"
curl "http://localhost:8000/api/cozinha/fila"
curl "http://localhost:8000/api/cozinha/fila?status=pronto"
curl -X PATCH "http://localhost:8000/api/pedidos/1/status" -H "Content-Type: application/json" -d "{\"status\":\"pronto\"}"
```

## Endpoints prontos

- `GET /api/produtos?page=1&per_page=15&search=&categoria=&order=` - lista paginada + filtros
- `GET /api/produtos/categorias` - categorias válidas
- `POST /api/produtos` - multipart/form-data (campos do cardápio + `foto` image)
- `GET /api/produtos/{id}`
- `PUT/PATCH /api/produtos/{id}` - json ou multipart (o app usa `POST` multipart com `_method=PUT`); parcial, aceita `remover_foto=true`
- `DELETE /api/produtos/{id}` - `204`
- `GET /api/mesas?status=livre|ocupada&ativa=1|0` - mesas com `status` calculado e `pedido_ativo`
- `POST /api/mesas` / `GET|PUT|DELETE /api/mesas/{id}` - CRUD das mesas (delete bloqueado com comanda ativa)
- `POST /api/pedidos` - abre a comanda (`mesa_id`, `observacao`)
- `GET /api/pedidos?status=&mesa_id=` / `GET /api/pedidos/{id}` - fila/histórico com itens
- `POST /api/pedidos/{id}/itens`, `PUT|DELETE /api/pedidos/{id}/itens/{item}` - itens (inclusão com a comanda `aberto` ou `entregue`; alteração/remoção só de itens `pendentes`)
- `POST /api/pedidos/{id}/enviar` - manda para a cozinha (precisa de pelo menos um item)
- `PATCH /api/pedidos/{id}/status` - `em_preparo` | `pronto` | `entregue` | `fechado` | `cancelado`; repetir o status atual é idempotente (`200`, sem alterar timestamps)
- `GET /api/cozinha/fila?status=em_preparo|pronto` - fila da cozinha (padrão `em_preparo`), mais antigas primeiro; status inválido → 422

A foto é tratada em `ProdutoService::storeFoto()` com disco `public` (`storage/app/public/produtos`); basta enviar `foto` como image. No app, a inserção e a edição já enviam `fotoUri`.

## Próximos passos sugeridos

- Autenticar as rotas com Sanctum (hoje são públicas).
- Expor no app um botão "Remover foto" na edição (o backend já aceita `remover_foto=true`).
- Paginação na UI com `onEndReached` em vez de carregar tudo.
- Melhorias possíveis no garçom: divisão de itens por pessoa, fechamento de conta com pagamento/impressão e cancelamento de uma rodada específica.
- Melhorias possíveis na cozinha: alerta sonoro/visual de comanda nova, filtro por categoria de prato no painel e impressão da comanda.
