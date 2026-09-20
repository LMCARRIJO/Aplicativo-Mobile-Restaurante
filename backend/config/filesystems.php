<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Disco Padrão do Sistema de Arquivos
    |--------------------------------------------------------------------------
    |
    | Aqui você pode especificar o disco padrão do sistema de arquivos que deve
    | ser usado pelo framework. O disco "local", assim como vários discos
    | baseados em nuvem, estão disponíveis para armazenamento de arquivos.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Discos do Sistema de Arquivos
    |--------------------------------------------------------------------------
    |
    | Abaixo você pode configurar quantos discos de sistema de arquivos forem
    | necessários, e pode até configurar múltiplos discos para o mesmo driver.
    | Exemplos para a maioria dos drivers suportados já estão configurados aqui
    | para referência.
    |
    | Drivers suportados: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Links Simbólicos
    |--------------------------------------------------------------------------
    |
    | Aqui você pode configurar os links simbólicos que serão criados quando o
    | comando Artisan `storage:link` for executado. As chaves do array devem ser
    | os locais dos links e os valores devem ser seus destinos.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
