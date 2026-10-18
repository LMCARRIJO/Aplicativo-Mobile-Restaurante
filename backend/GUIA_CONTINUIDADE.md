# Continuidade - cadastro de cardápio pronto

Este backend representa o **cardápio de um restaurante** (pratos e bebidas), com camada OO e cobertura dos tipos exigidos (numbers, strings, dates, foto):

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
- `index` aceita `per_page` (1..100, default 15); o frontend percorre todas as páginas.
- A exclusão usa o modal próprio `frontend/src/shared/components/ModalConfirmacao.tsx` (confirmação dentro do app, sem `window.confirm`), funcionando em web e nativo.
- Diálogos informativos cross-platform em `frontend/src/shared/utils/dialogos.ts`: `alerta()` delega ao `AvisoProvider` (`frontend/src/shared/components/AvisoProvider.tsx`, montado no `_layout`), que abre o `ModalAviso` dentro do app. Não se usa mais `window.alert` no web.
- A foto é exibida via `urlFoto(foto_path)` (origem da `API_URL` + `/storage/`) no `ProdutoCard`/`ProdutoFormScreen`. O `foto_url` do backend depende de `APP_URL`, então `http://localhost:8000` não carrega no Codespace/emulador.
- Edição no app envia multipart com `_method=PUT`, permitindo trocar a foto.
- Symlink `public/storage` recriado (se ele virar pasta comum no clone, rode `php artisan storage:link`).

## Como testar

```bash
php artisan migrate:fresh --seed
php artisan test
php artisan serve --host=0.0.0.0 --port=8000
curl "http://localhost:8000/api/produtos?per_page=100"
```

## Endpoints prontos

- `GET /api/produtos?page=1&per_page=15` - lista paginada
- `POST /api/produtos` - multipart/form-data (campos do cardápio + `foto` image)
- `GET /api/produtos/{id}`
- `PUT/PATCH /api/produtos/{id}` - json ou multipart (o app usa `POST` multipart com `_method=PUT`)
- `DELETE /api/produtos/{id}` - `204`

A foto é tratada em `ProdutoService::storeFoto()` com disco `public` (`storage/app/public/produtos`); basta enviar `foto` como image. No app, a inserção e a edição já enviam `fotoUri`.

## Próximos passos sugeridos

- Autenticar as rotas com Sanctum (hoje são públicas).
- Opção de remover a foto existente na edição (hoje só seleciona/troca).
- Paginação na UI com `onEndReached` em vez de carregar tudo.
