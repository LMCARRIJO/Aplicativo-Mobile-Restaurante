<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Nome da Aplicação
    |--------------------------------------------------------------------------
    |
    | Este valor é o nome da sua aplicação, que será usado quando o
    | framework precisar exibir o nome da aplicação em uma notificação ou
    | outros elementos de interface onde o nome precisa ser exibido.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Ambiente da Aplicação
    |--------------------------------------------------------------------------
    |
    | Este valor determina o "ambiente" em que sua aplicação está rodando
    | atualmente. Isso pode determinar como você prefere configurar vários
    | serviços que a aplicação utiliza. Defina isso no arquivo ".env".
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Modo de Depuração da Aplicação
    |--------------------------------------------------------------------------
    |
    | Quando sua aplicação está em modo de depuração, mensagens de erro
    | detalhadas com rastreamento (stack traces) serão exibidas em cada erro
    | que ocorrer dentro da aplicação. Se desativado, uma página de erro
    | genérica e simples será exibida.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | URL da Aplicação
    |--------------------------------------------------------------------------
    |
    | Esta URL é usada pelo console para gerar URLs corretamente ao usar
    | a ferramenta de linha de comando Artisan. Você deve defini-la como a
    | raiz da aplicação para que fique disponível dentro dos comandos Artisan.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Fuso Horário da Aplicação
    |--------------------------------------------------------------------------
    |
    | Aqui você pode especificar o fuso horário padrão para sua aplicação, que
    | será usado pelas funções de data e hora do PHP. Por padrão é "UTC",
    | pois é adequado para a maioria dos casos.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Configuração de Idioma da Aplicação
    |--------------------------------------------------------------------------
    |
    | O idioma (locale) da aplicação determina o idioma padrão que será usado
    | pelos métodos de tradução/localização do Laravel. Esta opção pode ser
    | definida para qualquer idioma no qual você planeje ter strings traduzidas.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Chave de Criptografia
    |--------------------------------------------------------------------------
    |
    | Esta chave é utilizada pelos serviços de criptografia do Laravel e deve
    | ser definida como uma string aleatória de 32 caracteres para garantir
    | que todos os valores criptografados sejam seguros. Faça isso antes de
    | implantar a aplicação.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Driver do Modo de Manutenção
    |--------------------------------------------------------------------------
    |
    | Estas opções de configuração determinam o driver usado para verificar e
    | gerenciar o status de "modo de manutenção" do Laravel. O driver "cache"
    | permitirá que o modo de manutenção seja controlado entre várias máquinas.
    |
    | Drivers suportados: "file", "cache", "array"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
