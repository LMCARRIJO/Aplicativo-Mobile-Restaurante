<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Armazenamento Padrão de Cache
    |--------------------------------------------------------------------------
    |
    | Esta opção controla o armazenamento de cache padrão que será usado pelo
    | framework. Esta conexão é utilizada caso outra não seja explicitamente
    | especificada ao executar uma operação de cache dentro da aplicação.
    |
    */

    'default' => env('CACHE_STORE', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Armazenamentos de Cache
    |--------------------------------------------------------------------------
    |
    | Aqui você pode definir todos os armazenamentos de "cache" para sua
    | aplicação, bem como seus drivers. Você pode até definir múltiplos
    | armazenamentos para o mesmo driver para agrupar tipos de itens
    | armazenados nos seus caches.
    |
    | Drivers suportados: "array", "database", "file", "memcached",
    |                    "redis", "dynamodb", "storage", "octane",
    |                    "session", "failover", "null"
    |
    */

    'stores' => [

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_CACHE_CONNECTION'),
            'table' => env('DB_CACHE_TABLE', 'cache'),
            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'),
            'lock_table' => env('DB_CACHE_LOCK_TABLE'),
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
            'lock_path' => storage_path('framework/cache/data'),
        ],

        'storage' => [
            'driver' => 'storage',
            'disk' => env('CACHE_STORAGE_DISK'),
            'path' => env('CACHE_STORAGE_PATH', 'framework/cache/data'),
        ],

        'memcached' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'sasl' => [
                env('MEMCACHED_USERNAME'),
                env('MEMCACHED_PASSWORD'),
            ],
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
            'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default'),
        ],

        'dynamodb' => [
            'driver' => 'dynamodb',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        'octane' => [
            'driver' => 'octane',
        ],

        'failover' => [
            'driver' => 'failover',
            'stores' => [
                'database',
                'array',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Prefixo da Chave de Cache
    |--------------------------------------------------------------------------
    |
    | Ao usar os armazenamentos de cache APC, database, memcached, Redis e
    | DynamoDB, pode haver outras aplicações usando o mesmo cache. Por isso,
    | você pode prefixar cada chave de cache para evitar colisões.
    |
    */

    'prefix' => env('CACHE_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-cache-'),

    /*
    |--------------------------------------------------------------------------
    | Classes Serializáveis
    |--------------------------------------------------------------------------
    |
    | Este valor determina as classes que podem ser desserializadas (unserialized)
    | a partir do armazenamento de cache. Por padrão, nenhuma classe PHP será
    | desserializada do seu cache para prevenir ataques de cadeia de gadgets
    | caso sua APP_KEY seja vazada.
    |
    */

    'serializable_classes' => false,

];
