<?php

use App\Models\User;

return [

    /*
    |--------------------------------------------------------------------------
    | Padrões de Autenticação
    |--------------------------------------------------------------------------
    |
    | Esta opção define o "guard" de autenticação padrão e o "broker" de
    | redefinição de senha para sua aplicação. Você pode alterar esses valores
    | conforme necessário, mas são um ótimo ponto de partida para a maioria
    | das aplicações.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Guards de Autenticação
    |--------------------------------------------------------------------------
    |
    | Em seguida, você pode definir cada guard de autenticação para sua
    | aplicação. Uma configuração padrão excelente já foi definida para você
    | que utiliza armazenamento de sessão mais o provedor de usuário Eloquent.
    |
    | Todos os guards de autenticação possuem um provedor de usuário, que
    | define como os usuários são realmente recuperados do seu banco de dados
    | ou outro sistema de armazenamento usado pela aplicação. Normalmente,
    | o Eloquent é utilizado.
    |
    | Suportados: "session"
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Provedores de Usuário
    |--------------------------------------------------------------------------
    |
    | Todos os guards de autenticação possuem um provedor de usuário, que
    | define como os usuários são recuperados do banco de dados ou outro
    | sistema de armazenamento. Normalmente o Eloquent é utilizado.
    |
    | Se você tiver múltiplas tabelas ou modelos de usuário, pode configurar
    | múltiplos provedores para representar cada modelo/tabela. Esses
    | provedores podem então ser atribuídos a qualquer guard extra que você
    | tenha definido.
    |
    | Suportados: "database", "eloquent"
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', User::class),
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Redefinição de Senhas
    |--------------------------------------------------------------------------
    |
    | Estas opções especificam o comportamento da funcionalidade de redefinição
    | de senha do Laravel, incluindo a tabela usada para armazenamento de tokens
    | e o provedor de usuário que é chamado para recuperar os usuários.
    |
    | O tempo de expiração é o número de minutos que cada token de redefinição
    | será considerado válido. Este recurso de segurança mantém os tokens com
    | vida curta para que tenham menos tempo para serem adivinhados. Você pode
    | alterar conforme necessário.
    |
    | A configuração de throttling é o número de segundos que o usuário deve
    | esperar antes de gerar mais tokens de redefinição. Isso impede que o
    | usuário gere rapidamente uma quantidade muito grande de tokens.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Tempo Limite para Confirmação de Senha
    |--------------------------------------------------------------------------
    |
    | Aqui você pode definir o número de segundos antes que a janela de
    | confirmação de senha expire e o usuário seja solicitado a digitar
    | novamente a senha na tela de confirmação. Por padrão, o tempo limite
    | dura três horas.
    |
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
