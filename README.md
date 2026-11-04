# Restaurante Mobile - Laravel API + Expo TS

Aplicativo de restaurante com autenticação por perfil e três áreas operacionais no mesmo frontend:

- **Cardápio**: CRUD de produtos, categorias, preços promocionais e foto.
- **Mesas/Comandas**: abertura de mesa, itens, envio para a cozinha, nova rodada e fechamento.
- **Cozinha**: fila de preparo, acompanhamento de tempo e marcação de pedido pronto.

O acesso é controlado por **Sanctum** com os perfis `admin`, `garcom` e `cozinha`.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Backend | Laravel 13, PHP 8.3+, Sanctum, SQLite, PHPUnit, Laravel Pint |
| Frontend | Expo SDK 58, Expo Router, React 19, React Native 0.88, TypeScript, React Query, Axios, React Hook Form, Zod |

## Estrutura

```text
Aplicativo-Mobile-Restaurante/
  backend/   # API Laravel, autenticação, regras de negócio e testes
  frontend/  # App Expo Router (web, Android, iOS e Expo Go)
  AI_PROJECT_CONTEXT.md
```

## Requisitos

- PHP **8.3+** com `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip`.
- Composer **2.x**.
- Node.js **20+** e npm.
- SQLite (padrão do projeto).
- Expo Go no celular (opcional) ou emulador Android/iOS.
- Celular e computador na mesma rede Wi-Fi para testar via Expo Go em LAN.

Versões verificadas no ambiente local: PHP `8.3.33`, Composer `2.10.3`, Node `24.19.0` e npm `11.17.0`.

## Execução rápida

Abra **dois terminais**: um para o backend e outro para o frontend.

### 1. Backend

#### Windows PowerShell

```powershell
cd backend
composer install

if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path database/database.sqlite)) { New-Item database/database.sqlite -ItemType File }

php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=0.0.0.0 --port=8000
```

#### Linux/macOS

```bash
cd backend
composer install

test -f .env || cp .env.example .env
test -f database/database.sqlite || touch database/database.sqlite

php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=0.0.0.0 --port=8000
```

> `migrate:fresh --seed` apaga e recria o banco. Use `php artisan migrate --seed` apenas quando quiser preservar dados existentes. O seeder de produtos não é idempotente.

O backend ficará disponível em `http://localhost:8000`. O endpoint de saúde é `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

No terminal do Expo:

- pressione `w` para abrir no navegador;
- pressione `a` para abrir no emulador Android;
- escaneie o QR Code com o Expo Go para testar no celular.

Também é possível iniciar direto:

```bash
npm run web
npm run android
npm run ios
```

`npm run ios` exige macOS. Para Android físico ou Expo Go, mantenha o celular e o computador na mesma Wi-Fi e deixe o backend rodando com `--host=0.0.0.0`.

## Credenciais de teste

Criadas por `backend/database/seeders/UserSeeder.php`:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@restaurante.test` | `password` |
| Garçom | `garcom@restaurante.test` | `password` |
| Cozinha | `cozinha@restaurante.test` | `password` |

O frontend abre a tela de login quando não há sessão. Após o login, as abas e rotas são exibidas conforme o perfil.

## Permissões

| Área | `admin` | `garcom` | `cozinha` |
| --- | --- | --- | --- |
| Cardápio - consultar | Sim | Sim | Não |
| Cardápio - criar/editar/excluir | Sim | Não | Não |
| Mesas - consultar | Sim | Sim | Não |
| Mesas - criar/editar/excluir | Sim | Não | Não |
| Comandas e itens | Sim | Sim | Consulta pela fila/pedido |
| Enviar para cozinha | Sim | Sim | Não |
| Marcar `pronto` | Sim | Não | Sim |
| Entregar, fechar e cancelar | Sim | Sim | Não |
| Painel da cozinha | Sim | Não | Sim |

O backend aplica a matriz com `auth:sanctum` + middleware `role`. O frontend também esconde abas, botões e rotas sem permissão.

## API

Todas as rotas usam o prefixo `/api`. Apenas `POST /api/login` e `GET /api/health` são públicas; as demais exigem:

```http
Authorization: Bearer <token>
Accept: application/json
```

### Autenticação

- `POST /api/login` - `{ "email": "...", "password": "..." }`; retorna `{ data: { token, token_type, usuario } }`. Limite de 6 tentativas por minuto.
- `GET /api/me` - usuário do token atual.
- `POST /api/logout` - revoga o token atual e retorna `204`.

O token expira em **30 dias** (`SANCTUM_EXPIRATION=43200`).

### Produtos

- `GET /api/produtos?page=1&per_page=15&search=&categoria=&order=`
- `GET /api/produtos/categorias`
- `POST /api/produtos` - multipart com os campos do cardápio + `foto`
- `GET /api/produtos/{id}`
- `PUT/PATCH /api/produtos/{id}` - parcial; aceita `foto` e `remover_foto=true`
- `DELETE /api/produtos/{id}` - `204`

### Mesas

- `GET /api/mesas?status=livre|ocupada&ativa=1|0`
- `POST /api/mesas`
- `GET /api/mesas/{id}`
- `PUT/PATCH /api/mesas/{id}`
- `DELETE /api/mesas/{id}` - bloqueado se houver comanda ativa

### Comandas

- `POST /api/pedidos` - `{ mesa_id, observacao? }`
- `GET /api/pedidos?status=&mesa_id=`
- `GET /api/pedidos/{id}`
- `POST /api/pedidos/{id}/itens` - `{ produto_id, quantidade, observacao? }`
- `PUT/DELETE /api/pedidos/{id}/itens/{item}`
- `POST /api/pedidos/{id}/enviar`
- `PATCH /api/pedidos/{id}/status` - `em_preparo`, `pronto`, `entregue`, `fechado` ou `cancelado`

### Cozinha e saúde

- `GET /api/cozinha/fila?status=em_preparo|pronto`
- `GET /api/health`

### Exemplo de login

```bash
curl -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@restaurante.test","password":"password"}'
```

No PowerShell, uma alternativa é:

```powershell
$login = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8000/api/login" `
  -ContentType "application/json" `
  -Body '{"email":"admin@restaurante.test","password":"password"}'

$token = $login.data.token

Invoke-RestMethod -Uri "http://localhost:8000/api/produtos" `
  -Headers @{ Authorization = "Bearer $token" }
```

## URL da API no frontend

A URL é detectada automaticamente em `frontend/src/shared/lib/http.ts`:

- **Web local**: `http://localhost:8081` -> API em `http://localhost:8000/api`.
- **Web/Expo Go via LAN**: usa o IP do computador na porta `8000`.
- **Emulador Android**: usa `10.0.2.2:8000`.
- **GitHub Codespaces**: troca a porta `8081` por `8000` no host.

Para sobrescrever, crie `frontend/.env`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.XX:8000/api
```

Depois reinicie o Expo com `npx expo start --clear`. O arquivo `frontend/.env.example` documenta os cenários.

## Testes e verificações

### Backend

```bash
cd backend
php artisan test
vendor/bin/pint
```

Resultado atual: **60 testes, 420 assertions**.

Cobertura:

- `ProdutoApiTest` (12)
- `MesaApiTest` (8)
- `PedidoApiTest` (17)
- `CozinhaApiTest` (6)
- `AuthApiTest` (5)
- `AutorizacaoApiTest` (10)
- Examples (2)

### Frontend

```bash
cd frontend
npx tsc --noEmit
npx expo export --platform web
npx expo export --platform android
```

## Solução de problemas

### Login retorna 404 ou rotas antigas

Limpe caches de rota/configuração:

```bash
cd backend
php artisan route:clear
php artisan optimize:clear
```

### Erro de banco SQLite inexistente

Crie o arquivo e rode as migrations novamente:

```powershell
New-Item backend/database/database.sqlite -ItemType File
php artisan migrate:fresh --seed
```

### Fotos não aparecem

Confirme o link público do storage:

```bash
cd backend
php artisan storage:link
```

Se `public/storage` já existir como pasta comum, remova e recrie o link.

### `401` nas rotas protegidas

- Confirme o header `Authorization: Bearer <token>`.
- Faça login novamente; tokens expiram em 30 dias.
- Confirme que está usando a URL correta da API.

### Expo Go não conecta na API

- Suba o backend com `--host=0.0.0.0`.
- Verifique o IP local com `ipconfig` (Windows) ou `ifconfig`/`ip addr` (Linux/macOS).
- Libere `php.exe` no firewall do Windows para redes privadas.
- Teste `http://<IP>:8000/api/health` no navegador do celular.
- Se necessário, defina `EXPO_PUBLIC_API_URL` em `frontend/.env`.

### `403` em uma ação

O usuário autenticado não tem permissão para aquela ação. Use um perfil com acesso ou ajuste a regra no backend/frontend de forma explícita.

## Documentação adicional

- `AI_PROJECT_CONTEXT.md` - contexto técnico detalhado para agentes/IA.
- `backend/GUIA_CONTINUIDADE.md` - decisões de backend, contrato da API e fluxos.
- `backend/.env.example` - variáveis do backend.
- `frontend/.env.example` - variáveis do frontend.

## Observações

- Os arquivos `.env` reais não devem ser versionados.
- O banco SQLite de desenvolvimento fica em `backend/database/database.sqlite` e também não deve ser versionado.
- O backend usa `FILESYSTEM_DISK=local` por padrão, mas as fotos de produtos usam o disco `public`.
