<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Nome da Conexão Padrão da Fila
    |--------------------------------------------------------------------------
    |
    | A fila do Laravel suporta uma variedade de backends através de uma API
    | única e unificada, dando acesso conveniente a cada backend usando a mesma
    | sintaxe. A conexão padrão da fila é definida abaixo.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Conexões da Fila
    |--------------------------------------------------------------------------
    |
    | Aqui você pode configurar as opções de conexão para cada backend de fila
    | usado pela sua aplicação. Um exemplo de configuração é fornecido para
    | cada backend suportado pelo Laravel. Você também é livre para adicionar
    | mais conexões.
    |
    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis",
    |          "deferred", "background", "failover", "null"
    |
    */

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_QUEUE_CONNECTION'),
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            'queue' => env('DB_QUEUE', 'default'),
            'retry_after' => (int) env('DB_QUEUE_RETRY_AFTER', 90),
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
            'queue' => env('BEANSTALKD_QUEUE', 'default'),
            'retry_after' => (int) env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
            'block_for' => null,
            'after_commit' => false,
        ],

        'deferred' => [
            'driver' => 'deferred',
        ],

        'background' => [
            'driver' => 'background',
        ],

        'failover' => [
            'driver' => 'failover',
            'connections' => [
                'database',
                'deferred',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Agrupamento de Jobs (Job Batching)
    |--------------------------------------------------------------------------
    |
    | As seguintes opções configuram o banco de dados e a tabela que armazenam
    | informações de agrupamento de jobs. Essas opções podem ser atualizadas
    | para qualquer conexão e tabela já definidas pela sua aplicação.
    |
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Jobs Falhados na Fila
    |--------------------------------------------------------------------------
    |
    | Estas opções configuram o comportamento do registro de jobs falhados para
    | que você possa controlar como e onde os jobs falhados são armazenados.
    | O Laravel já vem com suporte para armazenar jobs falhados em um arquivo
    | simples ou no banco de dados.
    |
    | Drivers suportados: "database-uuids", "dynamodb", "file", "null"
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],

];
