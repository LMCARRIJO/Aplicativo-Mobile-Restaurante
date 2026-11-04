<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Serviços de Terceiros
    |--------------------------------------------------------------------------
    |
    | Este arquivo serve para armazenar as credenciais de serviços de terceiros
    | como Resend, Postmark, AWS e outros. Este arquivo fornece o local padrão
    | para este tipo de informação, permitindo que pacotes tenham um arquivo
    | convencional para localizar as várias credenciais de serviço.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
