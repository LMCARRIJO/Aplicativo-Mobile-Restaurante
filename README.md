# Restaurante Mobile - Laravel API + Expo TS

## Estrutura
```
Restaurante-Mobile/
  backend/  # Laravel 13 + PHP 8.3+ (runtime 8.4.15) API REST (OOP)
  frontend/ # Expo Router + TypeScript (feature-driven)
```

## Backend - 7 atributos (OO)
- `backend/app/Models/Produto.php:1` - Model com `HasFactory`, casts, accessor `foto_url`
- `backend/app/Services/ProdutoService.php:1` - Service layer (SOLID, upload/storage)
- `backend/app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1` - validação
- `backend/app/Http/Resources/ProdutoResource.php:1` - serialização
- `backend/app/Http/Controllers/Api/ProdutoController.php:1` - CRUD magro, `per_page` no index
- `backend/routes/api.php:1` - `apiResource('produtos')`
- `backend/database/migrations/2026_09_20_173920_create_produtos_table.php:1` - 3 campos base
- `backend/database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1` - +4 campos
- Foto: `storage/app/public/produtos` + `php artisan storage:link` (garanta que `public/storage` seja symlink)

Atributos: `nome` (string), `preco` (decimal), `foto_path` (foto), `descricao` (text), `quantidade_estoque` (integer), `data_validade` (date), `categoria` (string)

## Rodar Backend
```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=0.0.0.0 --port=8000
# Testes
php artisan test --filter=ProdutoApiTest
```

Endpoints:
- `GET http://localhost:8000/api/produtos?page=1&per_page=15`
- `POST http://localhost:8000/api/produtos` multipart `nome, preco, descricao, quantidade_estoque, data_validade, categoria, foto`
- `GET/PUT/DELETE http://localhost:8000/api/produtos/{id}`

## Frontend (Expo Router + feature-driven)
```bash
cd frontend
npm install
# Ajuste IP em src/features/produtos/services/produtosApi.ts ou .env
# EXPO_PUBLIC_API_URL=http://192.168.0.XX:8000/api
npm start
```
Estrutura por funcionalidade:
- `frontend/src/app/` - rotas do Expo Router (`index`, `produto/novo`, `produto/[id]`)
- `frontend/src/features/produtos/` - `components/`, `hooks/`, `services/`, `types/`, `screens/`
- `frontend/src/shared/` - `components/` (Botao, Campo) e `utils/` (format)

`src/features/produtos/services/produtosApi.ts:1` centraliza o fetch (pagina todas as páginas); as telas ficam em `screens/` e as rotas apenas as importam.

Fluxos do CRUD:
- **Inserir**: botão "Novo produto" → form com os 7 campos + foto (`expo-image-picker`) → `POST /api/produtos` (multipart); lista recarrega ao voltar.
- **Editar**: toque em "Editar" → `POST` multipart com `_method=PUT` (troca foto inclusive).
- **Excluir**: botão "Excluir" com confirmação (`Alert`) → `DELETE /api/produtos/{id}`.

## Tipos cobertos
- numbers: `preco` decimal, `quantidade_estoque` integer
- strings: `nome`, `descricao`, `categoria`
- datas: `data_validade` date + `created_at`
- foto: `foto_path` upload image max 2MB
