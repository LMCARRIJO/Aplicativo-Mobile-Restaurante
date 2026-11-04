<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuração de CORS
    |--------------------------------------------------------------------------
    |
    | Aqui você configura o Compartilhamento de Recursos entre Origens
    | Diferentes (CORS). Define quais caminhos, métodos, origens e cabeçalhos
    | são permitidos para requisições vindas de outros domínios, como o
    | frontend Expo.
    |
    */

    // Caminhos que terão CORS aplicado (API, Sanctum e arquivos públicos)
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],

    // Métodos HTTP permitidos (* = todos)
    'allowed_methods' => ['*'],

    // Origens permitidas (* = todas, ajuste para produção)
    'allowed_origins' => ['*'],

    // Padrões de origens permitidas (regex)
<<<<<<< HEAD
    'allowed_origins_patterns' => ['*'],
=======
    'allowed_origins_patterns' => [],
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54

    // Cabeçalhos permitidos na requisição
    'allowed_headers' => ['*'],

    // Cabeçalhos expostos na resposta
    'exposed_headers' => [],

    // Tempo máximo em segundos que o resultado do preflight pode ser cacheado
    'max_age' => 0,

    // Define se a requisição pode incluir credenciais (cookies, auth)
    'supports_credentials' => false,
];
