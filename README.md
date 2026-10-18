# Restaurante Mobile - Laravel API + Expo TS

## Estrutura
```
Restaurante-Mobile/
  backend/  # Laravel 13 + PHP 8.3+ (runtime 8.4.15) API REST (OOP)
  frontend/ # Expo Router + TypeScript (feature-driven)
```

## Backend - cardápio (OO)
- `backend/app/Models/Produto.php:1` - Model com `HasFactory`, casts, accessor `foto_url`
- `backend/app/Services/ProdutoService.php:1` - Service layer (SOLID, upload/storage)
- `backend/app/Http/Requests/StoreProdutoRequest.php:1` / `UpdateProdutoRequest.php:1` - validação
- `backend/app/Http/Resources/ProdutoResource.php:1` - serialização
- `backend/app/Http/Controllers/Api/ProdutoController.php:1` - CRUD magro, `per_page` no index
- `backend/routes/api.php:1` - `apiResource('produtos')`
- `backend/database/migrations/2026_09_20_173920_create_produtos_table.php:1` - 3 campos base
- `backend/database/migrations/2026_10_17_202211_add_campos_restantes_to_produtos_table.php:1` - campos iniciais
- `backend/database/migrations/2026_10_18_000000_add_campos_cardapio_to_produtos_table.php:1` - campos do cardápio (remove estoque/validade)
- Foto: `storage/app/public/produtos` + `php artisan storage:link` (garanta que `public/storage` seja symlink)

Atributos: `nome` (string), `preco` (decimal), `preco_promocional` (decimal), `foto_path` (foto), `descricao` (text), `ingredientes` (text), `alergenicos` (string), `porcao` (integer), `disponivel` (boolean), `promocao_fim` (date), `categoria` (string fixa)

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
- `POST http://localhost:8000/api/produtos` multipart `nome, preco, preco_promocional, descricao, ingredientes, alergenicos, porcao, disponivel, promocao_fim, categoria, foto`
- `GET/PUT/DELETE http://localhost:8000/api/produtos/{id}`

## Frontend (Expo Router + feature-driven)
```bash
cd frontend
npm install
# Configure a URL da API em frontend/.env (veja opções abaixo e .env.example)
# EXPO_PUBLIC_API_URL=...
npm start
```

### Configurar `EXPO_PUBLIC_API_URL`
A URL depende de onde o backend roda em relação ao emulador/dispositivo (o valor
padrão do código é `http://10.0.2.2:8000/api`, que só funciona se backend e
emulador estiverem na MESMA máquina):

- **Backend no GitHub Codespace, app/emulador na sua máquina** (ex.: URL pública
  `https://<codespace>-8000.app.github.dev/api`):
  ```bash
  gh codespace ports visibility 8000:public --codespace <codespace-name>
  # frontend/.env
  EXPO_PUBLIC_API_URL=https://<codespace-name>-8000.app.github.dev/api
  ```
- **Emulador Android local com backend local**: `http://10.0.2.2:8000/api`
- **iOS simulator local com backend local**: `http://localhost:8000/api`
- **Device físico**: `http://<IP-LOCAL-DA-MAQUINA>:8000/api`

Após mudar o `.env`, reinicie o Expo com `npx expo start --clear` (variáveis
`EXPO_PUBLIC_*` são embutidas no bundle em tempo de build).
Estrutura por funcionalidade:
- `frontend/src/app/` - rotas do Expo Router (`index`, `produto/novo`, `produto/[id]`)
- `frontend/src/features/produtos/` - `components/`, `hooks/`, `services/`, `types/`, `screens/`
- `frontend/src/shared/` - `components/` (Botao, Campo, ModalConfirmacao, ModalAviso, AvisoProvider, SeletorChips) e `utils/` (format, dialogos)

`src/features/produtos/services/produtosApi.ts:1` centraliza o fetch (pagina todas as páginas); as telas ficam em `screens/` e as rotas apenas as importam.

Fluxos do CRUD:
- **Inserir**: botão "Novo produto" → form do cardápio (categoria e alergênicos em chips, disponibilidade em `Switch`, promoção) + foto (`expo-image-picker`) → `POST /api/produtos` (multipart); lista recarrega ao voltar.
- **Editar**: toque em "Editar" → `POST` multipart com `_method=PUT` (troca foto inclusive).
- **Excluir**: botão "Excluir" com confirmação no modal do app (`ModalConfirmacao`) → `DELETE /api/produtos/{id}`.
- **Feedback**: avisos de sucesso/erro/validação aparecem no modal do app (`ModalAviso`/`AvisoProvider`), sem `window.alert`; a foto é exibida via `urlFoto(foto_path)` a partir da origem da API.

## Tipos cobertos
- numbers: `preco`/`preco_promocional` decimal, `porcao` integer
- strings: `nome`, `categoria`, `alergenicos`
- textos: `descricao`, `ingredientes`
- datas: `promocao_fim` date + `created_at`
- booleano: `disponivel`
- foto: `foto_path` upload image max 2MB
