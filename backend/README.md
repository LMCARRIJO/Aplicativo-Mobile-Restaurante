<<<<<<< HEAD
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
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
