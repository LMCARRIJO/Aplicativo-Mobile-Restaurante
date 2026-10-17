---
project: Restaurante-Mobile
purpose: CRUD mobile com API Laravel + Expo TS - cadastro 7 atributos (numbers, strings, dates, foto)
ai_parseable: true
tags: [laravel, php, expo, typescript, crud, rest-api, storage, factory, resource, service-layer]
created: 2026-09-20
updated: 2026-10-17
stack_backend: Laravel 13.32.0 + PHP runtime 8.4.15 (composer ^8.3) + Sanctum 4.3.3 + SQLite (dev) + phpunit 12.5
stack_frontend: Expo SDK 57.0.30 + Expo Router 57.0.28 + expo-image-picker 57.0.20 + React 19.2.3 + React-Native 0.86.3 + TypeScript 6.0.3
status: backend_7_attrs_done_frontend_crud_completo_tests_green
---

# CONTEXTO PARA IA - Como o projeto foi constituído até agora

Este documento é otimizado para leitura e filtragem por Agentes de IA. Use os cabeçalhos como âncoras e os `file_path:line` para navegação.

## 1. Timeline de constituição

1. **Ambiente** projeto iniciado em `C:\Users\SONY VAIO\OneDrive\Documentos\vscode\Restaurante-Mobile`, hoje versionado em `/workspaces/Aplicativo-Mobile-Restaurante` (Codespaces/Linux). PHP 8.3+ exigido pelo `composer.json` (`^8.3`); runtime verificado **8.4.15**. Habilitados `zip, openssl, fileinfo, mbstring, pdo_sqlite, curl`. Atenção: **GD não está disponível** neste runtime (afeta `UploadedFile::fake()->image()`).
2. **Laravel** `composer create-project laravel/laravel backend` -> `laravel/framework v13.32.0`, `php artisan key:generate`, `php artisan migrate` (users/cache/jobs), `php artisan install:api` (Sanctum), `php artisan storage:link`.
3. **Entidade Produto** escolhida para restaurante (cobre todos os tipos exigidos). `php artisan make:model Produto -m` gerou `app/Models/Produto.php:1` e `database/migrations/2026_09_20_173920_create_produtos_table.php:1`.
4. **Camada OO** criada: `app/Services/ProdutoService.php:1` (Service), `app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1`, `app/Http/Resources/ProdutoResource.php:1`, `app/Http/Controllers/Api/ProdutoController.php:1`.
5. **Roteamento** `routes/api.php:1` com `apiResource`, registrado em `bootstrap/app.php:9` via `api: __DIR__.'/../routes/api.php'`. `config/cors.php:1` liberado para `api/*`.
6. **Persistência** `php artisan make:factory ProdutoFactory`, `php artisan make:seeder ProdutoSeeder`, `database/seeders/DatabaseSeeder.php:1` chama `ProdutoSeeder`, seed 10 registros.
7. **Testes** `tests/Feature/ProdutoApiTest.php:1` com `RefreshDatabase` + `Storage::fake` + CRUD + validação.
8. **Frontend (inicial)** `npx create-expo-app frontend --template blank-typescript` -> `frontend/package.json:1`, `frontend/App.tsx` reescrito para CRUD, `frontend/.env.example:1`. (Posteriormente substituído pela estrutura feature-driven com Expo Router.)
9. **Verificação** `Invoke-RestMethod http://127.0.0.1:8001/api/produtos` retornou paginação `data/links/meta`, `GET /api/health` ok.
10. **Comentários** reescritos de pessoa-para-pessoa em 2ª pessoa (você), sem uso de 3ª pessoa. `backend/GUIA_CONTINUIDADE.md:1` reescrito no mesmo tom.
11. **Continuação (2026-10-17)** os 4 atributos pendentes foram implementados: migration `database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1`, `descricao`, `quantidade_estoque`, `data_validade`, `categoria` liberados em Model/Requests/Resource/Factory e no frontend.
12. **Correções (2026-10-17)** `destroy` retorna `204` sem corpo (`response()->noContent()`), paginação aceita `per_page` (1..100) no backend e o frontend percorre todas as páginas, exclusão com `try/catch` (no antigo `App.tsx`, antes da reestruturação). Symlink `public/storage -> storage/app/public` recriado.
13. **Reestruturação feature-driven (2026-10-17)** frontend migrado para **Expo Router** (`expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`), entry `expo-router/entry`, rotas em `src/app/` e código por funcionalidade em `src/features/produtos/` + `src/shared/`. Removidos `App.tsx`, `index.ts`, `src/services/` e `src/types/`. Resolvido conflito de peer deps (`react-dom` fixado em `19.2.3`, `expo-font` em `~57.0.4`). `expo-doctor` 21/21 e `tsc` OK.
14. **Inserção/exclusão robustas (2026-10-17)** `ProdutoForm` ganhou `expo-image-picker` (selecionar/trocar foto com preview); `updateProduto` passou a enviar multipart com `_method=PUT` (foto também na edição); `ProdutosScreen` recarrega com `useFocusEffect` e confirma exclusão via `Alert`; `ProdutoFormScreen` mostra `Alert` de sucesso. Multipart `_method=PUT` validado via curl; `tsc`, `expo-doctor` 21/21 e `expo export` OK.

## 2. Mapa de diretórios

```
backend/
  app/Models/Produto.php:1               # Model + 7 fillable + casts + accessor foto_url
  app/Services/ProdutoService.php:1      # Lógica OO + upload, SOLID
  app/Http/Controllers/Api/ProdutoController.php:1 # CRUD magro, injeta Service, per_page
  app/Http/Requests/StoreProdutoRequest.php:1 # rules dos 7 atributos
  app/Http/Requests/UpdateProdutoRequest.php:1
  app/Http/Resources/ProdutoResource.php:1 # 7 campos + timestamps ISO8601
  bootstrap/app.php:9                    # withRouting api
  routes/api.php:1                       # apiResource produtos + /health
  config/cors.php:1                      # paths api/*, allowed_origins *
  config/filesystems.php:1               # disk public -> storage/app/public
  database/migrations/2026_09_20_173920_create_produtos_table.php:1 # base (3 campos)
  database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1 # +4 campos
  database/factories/ProdutoFactory.php:1
  database/seeders/ProdutoSeeder.php:1
  tests/Feature/ProdutoApiTest.php:1
  storage/app/public/produtos/           # destino foto; public/storage é symlink

frontend/
  app.json:1                             # Expo config + scheme + plugin expo-router + typedRoutes
  package.json:1                         # main expo-router/entry; expo ~57.0.30, expo-router ~57.0.28
  tsconfig.json:1                        # alias @/* -> ./src/*
  src/
    app/                                 # Expo Router (rotas finas: só importam screens)
      _layout.tsx:1                      # Stack + títulos
      index.tsx:1                        # -> ProdutosScreen
      produto/novo.tsx:1                 # -> ProdutoFormScreen (create)
      produto/[id].tsx:1                 # -> ProdutoFormScreen (edit)
    features/produtos/
      components/ProdutoCard.tsx:1       # card (foto, dados, editar/excluir)
      components/ProdutoForm.tsx:1       # form (6 campos) + expo-image-picker (foto/preview)
      hooks/useProdutos.ts:1             # lista/loading/refresh/remove (sem auto-load)
      services/produtosApi.ts:1          # list/get/create/update(multipart _method=PUT)/delete
      types/Produto.ts:1                 # Produto, ProdutoInput, PaginatedProdutos
      screens/ProdutosScreen.tsx:1       # lista + useFocusEffect + confirmação de exclusão
      screens/ProdutoFormScreen.tsx:1    # create/edit via param id + Alert de sucesso
    shared/
      components/Botao.tsx:1             # botão reutilizável (primary/danger/loading)
      components/Campo.tsx:1             # input com label
      utils/format.ts:1                  # formatarPreco, formatarData
```

## 3. Modelo de dados atual

**Tabela `produtos` (base + complemento):**
- `id` bigint PK
- `nome` string(150) required
- `preco` decimal(10,2) required
- `foto_path` string nullable (caminho relativo `produtos/xxx.jpg`)
- `descricao` text nullable
- `quantidade_estoque` integer default 0
- `data_validade` date nullable
- `categoria` string(80) nullable
- `created_at`, `updated_at` timestamps

**Model `Produto.php:15`:**
```php
fillable = [nome, preco, foto_path, descricao, quantidade_estoque, data_validade, categoria]
casts = [preco => decimal:2, quantidade_estoque => integer, data_validade => date]
attributes = [quantidade_estoque => 0] // default também em memória
getFotoUrlAttribute() => asset('storage/'.$foto_path)
HasFactory
```

## 4. Arquitetura backend - decisões para IA

- **Service Layer** para manter Controller magro: `ProdutoService::listAll(int $perPage = 15)` -> `paginate`, `create(array $data, ?UploadedFile $foto)`, `update(Produto $produto, array $data, ?UploadedFile $foto)`, `delete(Produto $produto)`, privados `storeFoto` (`$foto->store('produtos','public')`) e `deleteFoto` (`Storage::disk('public')->delete`).
- **FormRequest** autoriza `true`. Store: `nome required|string|max:150`, `preco required|numeric|min:0|max:999999.99`, `foto nullable|image|mimes:jpg,jpeg,png,webp|max:2048`, `descricao nullable|string|max:1000`, `quantidade_estoque nullable|integer|min:0`, `data_validade nullable|date|after:today`, `categoria nullable|string|max:80`. Update usa `sometimes` nos extras.
- **Resource** expõe `id, nome, preco, foto_path, foto_url, descricao, quantidade_estoque, data_validade (Y-m-d), categoria, created_at, updated_at` (ISO8601).
- **Controller** usa Route Model Binding `Produto $produto`, injeta `ProdutoService` no construtor. `index` lê `per_page` (clamp 1..100, default 15) e retorna `ProdutoResource::collection`. `store` -> `201`; `destroy` -> `response()->noContent()` (`204`).
- **Storage** disco `public`, `php artisan storage:link` cria `public/storage -> storage/app/public`. Se `public/storage` virar diretório comum (perdido no clone), `foto_url` retorna 404: apague a pasta e rode `php artisan storage:link`.
- **CORS** `config/cors.php:1` `allowed_origins *` para Expo (emulator 10.0.2.2, device IP local).
- **Autenticação** Sanctum instalado, mas as rotas são públicas (`authorize()` sempre `true`) - ponto a evoluir.

## 5. Contrato API

Base `http://localhost:8000/api` (ou `http://10.0.2.2:8000/api` emulator)

- `GET /produtos?page=1&per_page=15` -> `ProdutoResource::collection` paginada (per_page 1..100, default 15): `{data:[{id,nome,preco,foto_path,foto_url,descricao,quantidade_estoque,data_validade,categoria,created_at,updated_at}], links, meta}`
- `POST /produtos` multipart/form-data `nome, preco, descricao?, quantidade_estoque?, data_validade?, categoria?, foto?` -> 201 `{data:{...}}`, 422 validação
- `GET /produtos/{id}` -> 200 `{data:{...}}`, 404 se não existe
- `PUT/PATCH /produtos/{id}` json ou multipart `nome?, preco?, descricao?, quantidade_estoque?, data_validade?, categoria?, foto?` -> 200
- `DELETE /produtos/{id}` -> 204 (sem corpo)
- `GET /health` -> `{status: ok}`

Exemplo curl:
```bash
curl "http://localhost:8000/api/produtos?per_page=100"
curl -F "nome=Prato Teste" -F "preco=29.90" -F "quantidade_estoque=10" -F "categoria=Prato Principal" -F "foto=@foto.jpg" http://localhost:8000/api/produtos
```

## 6. Frontend - feature-driven (Expo Router)

- **Arquitetura por funcionalidade**: rotas em `src/app/` (finas, só importam as telas), lógica por feature em `src/features/produtos/`, código compartilhado em `src/shared/`. Alias `@/*` -> `src/*`.
- **Expo Router** com `main: expo-router/entry`; `app.json` tem `scheme: restaurantemobile`, plugin `expo-router` e `experiments.typedRoutes`.
- `src/features/produtos/services/produtosApi.ts:1` `API_URL = EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api'`.
  - `listProdutos()` percorre todas as páginas (`?page=N&per_page=100` até `meta.last_page`) e devolve `Produto[]`.
  - `getProduto(id)` (GET), `createProduto(ProdutoInput)` (FormData multipart), `updateProduto(id, data)` (multipart com `_method=PUT`, aceita foto), `deleteProduto(id)` (DELETE).
- `hooks/useProdutos.ts:1` encapsula `produtos`, `loading`, `refreshing`, `reload`, `refresh`, `remove` (com `try/catch` + `Alert`); sem auto-load (quem dispara é `useFocusEffect`).
- `screens/ProdutosScreen.tsx:1` lista com `FlatList` + `ProdutoCard`, `useFocusEffect` para recarregar ao voltar, navegação para `/produto/novo` e `/produto/[id]`, pull-to-refresh e **confirmação** de exclusão via `Alert`.
- `screens/ProdutoFormScreen.tsx:1` detecta `id` via `useLocalSearchParams`, cria (`createProduto`) ou edita (`updateProduto`) e exibe `Alert` de sucesso antes de voltar.
- `components/ProdutoForm.tsx:1` form controlado dos 6 campos + seletor de foto (`expo-image-picker`) com preview; envia `fotoUri`.
- `shared/` fornece `Botao` (primary/danger/loading), `Campo` (input com label) e `utils/format.ts` (`formatarPreco`, `formatarData`).
- `types/Produto.ts:1` `Produto {id, nome, preco:string, foto_path, foto_url, descricao?, quantidade_estoque?, data_validade?, categoria?, created_at, updated_at}` + `ProdutoInput` + `PaginatedProdutos`.

## 7. Testes e seeds

- `ProdutoFactory.php:17` `nome words(3), preco 5-200, foto_path null, descricao sentence(12), quantidade_estoque 0-100, data_validade +1 week..+2 months, categoria randomElement`
- `ProdutoSeeder.php:12` `Produto::factory()->count(10)->create()`
- `ProdutoApiTest.php:1` quatro testes: `test_crud_produto_com_foto` (post multipart com os 7 attrs, list, show, update, delete), `test_crud_apenas_campos_base` (só nome/preço, confere default 0), `test_validacao_nome_preco` (422), `test_validacao_campos_extras` (estoque negativo/data passada -> 422). Usa `Storage::fake('public')` e gera PNG via `createWithContent` (não depende de GD).

Rodar: `php artisan migrate:fresh --seed && php artisan test --filter=ProdutoApiTest`

## 8. Como estender (próximos passos possíveis)

1. **Auth**: aplicar `auth:sanctum` no `Route::apiResource` e um `login` por token; hoje tudo é público. No frontend, criar `src/features/auth/` com `screens/LoginScreen.tsx` e rota `src/app/(auth)/login.tsx`.
2. **Remover/trocar foto**: opção de remover a foto existente na edição (hoje só seleciona/troca).
3. **Paginação na UI**: usar `onEndReached` em vez de carregar todas as páginas de uma vez.
4. **Novas features**: seguir o padrão `src/features/<nome>/{components,hooks,services,types,screens}` e rota magra em `src/app/`.
5. **Qualidade**: CI com `php artisan test`, `pint --test`, `tsc --noEmit` e `expo-doctor`.

## 9. Convenções para IA filtrar

- Comentários de extensão podiam começar com `// Oi,`, `// Você` ou `// Quando você`; **após a conclusão dos 7 atributos esses marcadores foram resolvidos** (restam apenas comentários explicativos normais).
- Campos base originais: `nome`, `preco`, `foto_path`. Complemento: `descricao`, `quantidade_estoque`, `data_validade`, `categoria`.
- **Frontend feature-driven**: rotas em `src/app/*` nunca contêm regra de negócio (só reexportam `screens/`); cada feature isola `components/hooks/services/types/screens`; o que é genérico vai em `src/shared/`.
- `file_path:line` usado em docs para navegação direta.

## 10. Estado verificado

- `php artisan migrate:fresh --seed` com 5 migrations (users/cache/jobs/produtos/complemento), `Produto::count()` 10.
- `php artisan test` 6 passed (ProdutoApiTest 4 + ExampleTests 2), `pint --test` passed.
- `POST /api/produtos` multipart com os 7 atributos retorna 201 com todos os campos; `GET /api/produtos?per_page=2` pagina com `links/meta`; `POST` multipart com `_method=PUT` atualiza dados e troca a foto; `DELETE` 204.
- Frontend: `tsc --noEmit` OK, `expo-doctor` 21/21, `expo export --platform android` (Metro bundle) OK.
- Symlink `public/storage` verificado apontando para `storage/app/public`.

---
Gerado para consumo por LLMs/Agentes: filtre por `ai_parseable: true` e tags.
