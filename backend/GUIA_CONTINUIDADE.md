# Continuidade - os 7 atributos já estão prontos

Este backend começou com **3 atributos base** e agora cobre os **7 atributos** exigidos, todos com camada OO:

| Atributo | Tipo | Onde |
| --- | --- | --- |
| `nome` | string(150) | `app/Models/Produto.php:16` |
| `preco` | decimal(10,2) | `app/Models/Produto.php:17` |
| `foto_path` / `foto_url` | foto (storage) | `app/Services/ProdutoService.php:46` |
| `descricao` | text | migration de complemento |
| `quantidade_estoque` | integer (default 0) | migration de complemento |
| `data_validade` | date | migration de complemento |
| `categoria` | string(80) | migration de complemento |

Os 4 últimos foram adicionados em `database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1` (sem tocar na migration base `2026_09_20_173920`).

## O que foi feito

1. Migration de complemento com `descricao`, `quantidade_estoque`, `data_validade`, `categoria`.
2. Model `app/Models/Produto.php:1`: os 7 campos no `$fillable`, casts (`quantidade_estoque` integer, `data_validade` date) e default em memória `quantidade_estoque => 0`.
3. Requests `app/Http/Requests/StoreProdutoRequest.php:1` e `UpdateProdutoRequest.php:1`: regras dos 4 campos extras (`quantidade_estoque` como `nullable|integer|min:0`).
4. Resource `app/Http/Resources/ProdutoResource.php:1`: expõe os 7 campos (`data_validade` em `Y-m-d`).
5. Factory `database/factories/ProdutoFactory.php:1`: gera dados falsos dos 4 campos extras.
6. Frontend (estrutura feature-driven com Expo Router) com **CRUD completo**: tipos em `frontend/src/features/produtos/types/Produto.ts:1`, chamadas em `frontend/src/features/produtos/services/produtosApi.ts:1`, telas em `frontend/src/features/produtos/screens/`, componentes em `frontend/src/features/produtos/components/` e rotas em `frontend/src/app/`. Inserção/edição com foto via `expo-image-picker`, exclusão com confirmação e lista recarregada ao voltar (`useFocusEffect`).

## Correções aplicadas junto

- `destroy` agora responde `204` **sem corpo** (`response()->noContent()`).
- `index` aceita `per_page` (1..100, default 15); o frontend percorre todas as páginas.
- Exclusão no app pede confirmação (`Alert`) e trata erro com `try/catch` + `Alert`; a lista recarrega ao voltar (`useFocusEffect`).
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
- `POST /api/produtos` - multipart/form-data (7 campos + `foto` image)
- `GET /api/produtos/{id}`
- `PUT/PATCH /api/produtos/{id}` - json ou multipart (o app usa `POST` multipart com `_method=PUT`)
- `DELETE /api/produtos/{id}` - `204`

A foto é tratada em `ProdutoService::storeFoto()` com disco `public` (`storage/app/public/produtos`); basta enviar `foto` como image. No app, a inserção e a edição já enviam `fotoUri`.

## Próximos passos sugeridos

- Autenticar as rotas com Sanctum (hoje são públicas).
- Opção de remover a foto existente na edição (hoje só seleciona/troca).
- Paginação na UI com `onEndReached` em vez de carregar tudo.
