# Backend - API do Restaurante

API REST em Laravel 13 responsável por cardápio, mesas, comandas, fila da cozinha e autenticação por perfis.

## Requisitos

- PHP 8.3+
- Composer 2.x
- SQLite
- Extensões `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip`

## Setup

### Windows PowerShell

```powershell
composer install

if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path database/database.sqlite)) { New-Item database/database.sqlite -ItemType File }

php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=0.0.0.0 --port=8000
```

### Linux/macOS

```bash
composer install

test -f .env || cp .env.example .env
test -f database/database.sqlite || touch database/database.sqlite

php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=0.0.0.0 --port=8000
```

> `migrate:fresh --seed` recria o banco e apaga os dados existentes. O seeder de produtos não é idempotente.

A API fica em `http://localhost:8000/api`; o health check é `GET /api/health`.

## Usuários de teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@restaurante.test` | `password` |
| Garçom | `garcom@restaurante.test` | `password` |
| Cozinha | `cozinha@restaurante.test` | `password` |

Os usuários são criados por `database/seeders/UserSeeder.php`.

## Autenticação

- `POST /api/login` - retorna token Sanctum.
- `GET /api/me` - retorna o usuário do token.
- `POST /api/logout` - revoga o token atual.

As demais rotas exigem `Authorization: Bearer <token>`. O token expira em 30 dias (`SANCTUM_EXPIRATION=43200`). O login tem throttle de 6 tentativas por minuto.

## Testes

```bash
php artisan test
```

Resultado atual: **60 testes, 420 assertions**.

Testes principais:

- `ProdutoApiTest`
- `MesaApiTest`
- `PedidoApiTest`
- `CozinhaApiTest`
- `AuthApiTest`
- `AutorizacaoApiTest`

## Documentação

- `../README.md` - visão geral, execução completa e troubleshooting.
- `GUIA_CONTINUIDADE.md` - decisões de arquitetura, contrato da API e fluxos.
- `AGENTS.md` - diretrizes para agentes de IA neste backend.
