---
project: Restaurante-Mobile
purpose: CRUD mobile com API Laravel + Expo TS - cadastro 7 atributos (numbers, strings, dates, foto)
ai_parseable: true
tags: [laravel, php, expo, typescript, crud, rest-api, storage, factory, resource, service-layer]
created: 2026-09-20
stack_backend: Laravel 13.32.0 + PHP 8.3.33 + Sanctum 4.3.3 + SQLite (dev) + phpunit 12.5
stack_frontend: Expo SDK 57.0.24 + React 19.2.3 + React-Native 0.86.3 + TypeScript 6.0.3
status: backend_base_3_attrs_done_frontend_skeleton_done_4_attrs_pending
---

# CONTEXTO PARA IA - Como o projeto foi constituído até agora

Este documento é otimizado para leitura e filtragem por Agentes de IA. Use os cabeçalhos como âncoras e os `file_path:line` para navegação.

## 1. Timeline de constituição

1. **Ambiente** `backend:1` vazio em `C:\Users\SONY VAIO\OneDrive\Documentos\vscode\Restaurante-Mobile` -> instalado PHP 8.3 via winget, habilitado `zip, openssl, fileinfo, mbstring, pdo_sqlite, curl, gd` em `php.ini`, instalado Composer 2.10.3 via `getcomposer.org/installer`.
2. **Laravel** `composer create-project laravel/laravel backend` -> Laravel 13.32.0, `php artisan key:generate`, `php artisan migrate` (users/cache/jobs), `php artisan install:api` (Sanctum), `php artisan storage:link`.
3. **Entidade Produto** escolhida para restaurante (cobre todos os tipos exigidos). `php artisan make:model Produto -m` gerou `app/Models/Produto.php:1` e `database/migrations/2026_09_20_173920_create_produtos_table.php:1`.
4. **Camada OO** criada: `app/Services/ProdutoService.php:1` (Service), `app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1`, `app/Http/Resources/ProdutoResource.php:1`, `app/Http/Controllers/Api/ProdutoController.php:1`.
5. **Roteamento** `routes/api.php:1` com `apiResource`, registrado em `bootstrap/app.php:9` via `api: __DIR__.'/../routes/api.php'`. `config/cors.php:1` liberado para `api/*`.
6. **Persistência** `php artisan make:factory ProdutoFactory`, `php artisan make:seeder ProdutoSeeder`, `database/seeders/DatabaseSeeder.php:1` chama `ProdutoSeeder`, seed 10 registros.
7. **Testes** `tests/Feature/ProdutoApiTest.php:1` com `RefreshDatabase` + `Storage::fake` + CRUD + validação, verificado `php artisan test --filter=ProdutoApiTest` passed.
8. **Frontend** `npx create-expo-app frontend --template blank-typescript` -> `frontend/package.json:1`, `frontend/App.tsx:1` reescrito para CRUD, `frontend/src/types/Produto.ts:1`, `frontend/src/services/api.ts:1`, `frontend/.env.example:1`.
9. **Verificação** `Invoke-RestMethod http://127.0.0.1:8001/api/produtos` retornou paginação `data/links/meta`, `GET /api/health` ok.
10. **Comentários** reescritos de pessoa-para-pessoa em 2ª pessoa (você), sem uso de 3ª pessoa. `backend/GUIA_CONTINUIDADE.md:1` reescrito no mesmo tom.

## 2. Mapa de diretórios

```
backend/
  app/Models/Produto.php:1               # Model + casts + accessor foto_url
  app/Services/ProdutoService.php:1      # Lógica OO + upload, SOLID
  app/Http/Controllers/Api/ProdutoController.php:1 # CRUD magro, injeta Service
  app/Http/Requests/StoreProdutoRequest.php:1 # rules nome, preco, foto
  app/Http/Requests/UpdateProdutoRequest.php:1
  app/Http/Resources/ProdutoResource.php:1 # toArray id,nome,preco,foto_path,foto_url
  bootstrap/app.php:9                    # withRouting api
  routes/api.php:1                       # apiResource produtos + /health
  config/cors.php:1                      # paths api/*, allowed_origins *
  config/filesystems.php:1               # disk public -> storage/app/public
  database/migrations/2026_09_20_173920_create_produtos_table.php:1
  database/factories/ProdutoFactory.php:1
  database/seeders/ProdutoSeeder.php:1
  tests/Feature/ProdutoApiTest.php:1
  storage/app/public/produtos/           # destino foto, symlink public/storage

frontend/
  App.tsx:1                              # lista FlatList, form nome/preco, delete
  src/types/Produto.ts:1                 # interface Produto + PaginatedProdutos
  src/services/api.ts:1                  # API_URL, listProdutos, createProduto (FormData), deleteProduto
  app.json:1                             # Expo config
  package.json:1                         # expo ~57, react 19.2, react-native 0.86
```

## 3. Modelo de dados atual

**Tabela `produtos` (migration base):**
- `id` bigint PK
- `nome` string(150) required
- `preco` decimal(10,2) required
- `foto_path` string nullable (caminho relativo `produtos/xxx.jpg`)
- `created_at`, `updated_at` timestamps
- **Pendentes** (comentados, aguardando migration complementar): `descricao` text nullable, `quantidade_estoque` integer default 0, `data_validade` date nullable, `categoria` string(80) nullable

**Model `Produto.php:12`:**
```php
fillable = [nome, preco, foto_path] // + 4 comentados
casts = [preco => decimal:2] // + quantidade_estoque integer, data_validade date comentados
getFotoUrlAttribute() => asset('storage/'.$foto_path)
HasFactory
```

## 4. Arquitetura backend - decisões para IA

- **Service Layer** para manter Controller magro: `ProdutoService::listAll()->paginate`, `create(array $data, ?UploadedFile $foto)`, `update(Produto $produto, array $data, ?UploadedFile $foto)`, `delete(Produto $produto)`, privados `storeFoto` (`$foto->store('produtos','public')`) e `deleteFoto` (`Storage::disk('public')->delete`).
- **FormRequest** autoriza `true`, valida `nome required|string|max:150`, `preco required|numeric|min:0`, `foto nullable|image|mimes:jpg,jpeg,png,webp|max:2048`. Update usa `sometimes`.
- **Resource** expõe `id, nome, preco, foto_path, foto_url, created_at, updated_at` (ISO8601). Campos futuros comentados em `ProdutoResource.php:18`.
- **Controller** usa Route Model Binding `Produto $produto`, injeta `ProdutoService` no construtor, retorna `ProdutoResource::collection` e `response()->setStatusCode(201)` / `204`.
- **Storage** disco `public`, `php artisan storage:link` cria `public/storage -> storage/app/public`.
- **CORS** `config/cors.php:1` `allowed_origins *` para Expo (emulator 10.0.2.2, device IP local).

## 5. Contrato API

Base `http://localhost:8000/api` (ou `http://10.0.2.2:8000/api` emulator)

- `GET /produtos` -> `ProdutoResource::collection` paginado 15: `{data:[{id,nome,preco,foto_path,foto_url,created_at,updated_at}], links, meta}`
- `POST /produtos` multipart/form-data `nome, preco, foto?` -> 201 `{data:{...}}`, 422 validação
- `GET /produtos/{id}` -> 200 `{data:{...}}`, 404 se não existe
- `PUT/PATCH /produtos/{id}` json ou multipart `nome?, preco?, foto?` -> 200
- `DELETE /produtos/{id}` -> 204
- `GET /health` -> `{status: ok}`

Exemplo curl:
```bash
curl http://localhost:8000/api/produtos
curl -F "nome=Prato Teste" -F "preco=29.90" -F "foto=@foto.jpg" http://localhost:8000/api/produtos
```

## 6. Frontend - constituição

- **Expo blank-typescript** sem libs extras, usa `fetch` nativo (evita axios).
- `src/services/api.ts:4` `API_URL = EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api'`, funções `listProdutos` (GET), `createProduto` (FormData com `foto` uri/name/type), `deleteProduto` (DELETE).
- `App.tsx:1` estado `produtos, loading, nome, preco`, `load()` em `useEffect`, `handleCreate` valida, `FlatList` renderiza `nome, preco, foto_url Image, meta id+data`, botão Excluir.
- `src/types/Produto.ts:1` `Produto {id, nome, preco:string, foto_path, foto_url, created_at, updated_at}` + 4 opcionais comentados.
- Comentários pessoa-para-pessoa: `App.tsx:70` `// Oi, aqui você pode mostrar...`

## 7. Testes e seeds

- `ProdutoFactory.php:18` `nome words(3), preco 5-200, foto_path null` (+ 4 comentados)
- `ProdutoSeeder.php:9` `Produto::factory()->count(10)->create()`
- `ProdutoApiTest.php:12` dois testes: `test_crud_produto_com_foto` (post multipart, get list, get show, put, delete) e `test_validacao_nome_preco` (422). Usa `Storage::fake('public')`.

Rodar: `php artisan migrate:fresh --seed && php artisan test --filter=ProdutoApiTest`

## 8. Como estender (para IA que vai continuar)

1. **Migration** `php artisan make:migration add_campos_restantes_to_produtos_table` -> `Schema::table('produtos', ...)` com 4 campos (ver `GUIA_CONTINUIDADE.md:22`).
2. **Model** `Produto.php:16` descomentar `fillable` e `casts`.
3. **Requests** `StoreProdutoRequest.php:20` e `UpdateProdutoRequest.php:20` descomentar rules.
4. **Resource** `ProdutoResource.php:18` descomentar toArray.
5. **Factory** `ProdutoFactory.php:21` descomentar definition.
6. **Frontend** `Produto.ts:7` e `App.tsx:70` descomentar tipos e UI.

Não editar `2026_09_20_173920_create_produtos_table.php` base, apenas complementar.

## 9. Convenções para IA filtrar

- Comentários pendentes sempre começam com `// Oi,` ou `// Você` ou `// Quando você` -> indicam ponto de extensão.
- Todos os arquivos pendentes têm exatamente 4 linhas comentadas correspondentes aos 4 atributos.
- `file_path:line` usado em docs para navegação direta.

## 10. Estado verificado

- `php artisan migrate:status` 4 ran, `Produto::count() 10`, `route:list --path=api` 6 rotas, `php artisan test` passed, `Invoke-RestMethod /api/produtos` 200 com paginação.

---
Gerado para consumo por LLMs/Agentes: filtre por `ai_parseable: true` e tags.
