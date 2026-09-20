# Oi, aqui é onde você continua - 4 atributos restantes

Deixei este backend já com **3 atributos base** prontos pra você (camada OO):
- `nome` (string) - `app/Models/Produto.php:12`
- `preco` (decimal/number) - `app/Models/Produto.php:13`
- `foto_path` / `foto_url` (foto) - `app/Services/ProdutoService.php:1` + `app/Http/Requests/*`

Eu cuidei da base, agora você completa com os 4 que faltam, combinado?

## O que você vai adicionar
Sugestão pra cobrir todos os tipos que pediram (string + number + date):
1. `descricao` - `text` nullable (string longa)
2. `quantidade_estoque` - `integer` (number)
3. `data_validade` - `date` (data)
4. `categoria` - `string` (ex: Entrada, Prato Principal...)

## Como você faz, passo a passo (sem dar conflito com o que já fiz)

1. Cria uma migration nova sua (por favor, não mexe na minha base `2026_09_20_173920`):
```bash
php artisan make:migration add_campos_restantes_to_produtos_table
```
Conteúdo que te sugiro:
```php
Schema::table('produtos', function (Blueprint $table) {
    $table->text('descricao')->nullable()->after('nome');
    $table->integer('quantidade_estoque')->default(0)->after('preco');
    $table->date('data_validade')->nullable()->after('quantidade_estoque');
    $table->string('categoria', 80)->nullable()->after('data_validade');
});
```

2. Atualiza o Model `app/Models/Produto.php:1`:
- Descomenta `descricao, quantidade_estoque, data_validade, categoria` no `$fillable` - deixei anotado lá pra você
- Descomenta os casts também

3. Atualiza os Requests:
- `app/Http/Requests/StoreProdutoRequest.php:1` e `UpdateProdutoRequest.php:1` -> descomenta as regras que deixei pra você
- Dica que te dou: `quantidade_estoque` deixa como `required|integer|min:0` no store

4. Atualiza o Resource `app/Http/Resources/ProdutoResource.php:1` -> descomenta as 4 linhas que deixei lá

5. Factory `database/factories/ProdutoFactory.php:1` -> descomenta as 4 linhas também

6. Testa tudo que fizemos:
```bash
php artisan migrate:fresh --seed
php artisan test
curl http://localhost:8000/api/produtos
```

## Endpoints que já deixei prontos pra você usar
- `GET /api/produtos` - lista paginada
- `POST /api/produtos` - multipart/form-data (campos + `foto` image)
- `GET /api/produtos/{id}`
- `PUT/PATCH /api/produtos/{id}`
- `DELETE /api/produtos/{id}`

A foto eu já tratei em `ProdutoService::storeFoto()` com disco `public` (`storage/app/public/produtos`), você só precisa mandar `foto` como image.

## Frontend
`frontend/src/types/Produto.ts:1` e `frontend/App.tsx:1` já deixei comentários pra você liberar os novos campos quando quiser.

Qualquer dúvida, me chama - deixei tudo comentado de um jeito que você vai achar fácil.
