# Restaurante Mobile - Laravel API + Expo TS

## Estrutura
```
Restaurante-Mobile/
  backend/  # Laravel 13 PHP 8.3 API REST (OOP)
  frontend/ # Expo + TypeScript
```

## Backend - Seus 3 atributos (OO)
- `backend/app/Models/Produto.php:1` - Model com `HasFactory`, casts, accessor `foto_url`
- `backend/app/Services/ProdutoService.php:1` - Service layer (SOLID, upload/storage)
- `backend/app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1` - validação
- `backend/app/Http/Resources/ProdutoResource.php:1` - serialização
- `backend/app/Http/Controllers/Api/ProdutoController.php:1` - CRUD magro
- `backend/routes/api.php:1` - `apiResource('produtos')`
- `backend/database/migrations/2026_09_20_173920_create_produtos_table.php:1` - 3 campos base
- Foto: `storage/app/public/produtos` + `php artisan storage:link`

Atributos: `nome` (string), `preco` (decimal), `foto_path` (foto)

## Continuidade - 4 atributos que você vai adicionar
Veja `backend/GUIA_CONTINUIDADE.md:1` - deixei tudo anotado pra você continuar:
`descricao` (string/text), `quantidade_estoque` (integer), `data_validade` (date), `categoria` (string)

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
- `GET http://localhost:8000/api/produtos`
- `POST http://localhost:8000/api/produtos` multipart `nome, preco, foto`
- `GET/PUT/DELETE http://localhost:8000/api/produtos/{id}`

## Frontend
```bash
cd frontend
npm install
# Ajuste IP em src/services/api.ts ou .env
# EXPO_PUBLIC_API_URL=http://192.168.0.XX:8000/api
npm start
```
`frontend/src/services/api.ts:1` centraliza fetch, `frontend/App.tsx:1` lista/cria/deleta.

## Tipos exigidos
- numbers: `preco` decimal, `quantidade_estoque` integer (você adiciona esse segundo)
- strings: `nome`, `descricao`, `categoria`
- datas: `data_validade` date + `created_at`
- foto: `foto_path` upload image max 2MB
