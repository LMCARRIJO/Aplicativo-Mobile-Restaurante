<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Driver Padrão de Sessão
    |--------------------------------------------------------------------------
    |
    | Esta opção determina o driver de sessão padrão que é usado para
    | requisições recebidas. O Laravel suporta várias opções de armazenamento
    | para persistir dados de sessão. O armazenamento em banco de dados é uma
    | ótima escolha padrão.
    |
    | Suportados: "file", "cookie", "database", "memcached",
    |            "redis", "dynamodb", "array"
    |
    */

    'driver' => env('SESSION_DRIVER', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Tempo de Vida da Sessão
    |--------------------------------------------------------------------------
    |
    | Aqui você pode especificar o número de minutos que deseja que a sessão
    | permaneça ociosa antes de expirar. Se quiser que expire imediatamente
    | quando o navegador for fechado, indique pela opção expire_on_close.
    |
    */

    'lifetime' => (int) env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    /*
    |--------------------------------------------------------------------------
    | Criptografia da Sessão
    |--------------------------------------------------------------------------
    |
    | Esta opção permite especificar facilmente que todos os dados da sua sessão
    | devem ser criptografados antes de serem armazenados. Toda criptografia é
    | feita automaticamente pelo Laravel e você pode usar a sessão normalmente.
    |
    */

    'encrypt' => env('SESSION_ENCRYPT', false),

    /*
    |--------------------------------------------------------------------------
    | Local dos Arquivos de Sessão
    |--------------------------------------------------------------------------
    |
    | Ao usar o driver de sessão "file", os arquivos de sessão são colocados
    | no disco. O local padrão de armazenamento é definido aqui; porém, você
    | é livre para fornecer outro local onde devem ser armazenados.
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Conexão com Banco de Dados da Sessão
    |--------------------------------------------------------------------------
    |
    | Ao usar os drivers de sessão "database" ou "redis", você pode especificar
    | uma conexão que deve ser usada para gerenciar essas sessões. Deve
    | corresponder a uma conexão nas suas opções de configuração de banco.
    |
    */

    'connection' => env('SESSION_CONNECTION'),

    /*
    |--------------------------------------------------------------------------
    | Tabela do Banco de Dados da Sessão
    |--------------------------------------------------------------------------
    |
    | Ao usar o driver de sessão "database", você pode especificar a tabela a
    | ser usada para armazenar sessões. Um padrão sensato já é definido para
    | você; porém, sinta-se à vontade para mudar para outra tabela.
    |
    */

    'table' => env('SESSION_TABLE', 'sessions'),

    /*
    |--------------------------------------------------------------------------
    | Armazenamento de Cache da Sessão
    |--------------------------------------------------------------------------
    |
    | Ao usar um dos backends de sessão baseados em cache do framework, você pode
    | definir qual armazenamento de cache deve ser usado para guardar os dados
    | da sessão entre requisições. Deve corresponder a um dos armazenamentos
    | de cache que você definiu.
    |
    | Afeta: "dynamodb", "memcached", "redis"
    |
    */

    'store' => env('SESSION_STORE'),

    /*
    |--------------------------------------------------------------------------
    | Sorteio para Limpeza de Sessão
    |--------------------------------------------------------------------------
    |
    | Alguns drivers de sessão precisam varrer manualmente seu local de
    | armazenamento para remover sessões antigas. Aqui estão as chances de que
    | isso aconteça em uma requisição. Por padrão, as chances são 2 em 100.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Nome do Cookie de Sessão
    |--------------------------------------------------------------------------
    |
    | Aqui você pode mudar o nome do cookie de sessão criado pelo framework.
    | Normalmente não precisa mudar este valor, pois isso não traz melhoria
    | significativa de segurança.
    |
    */

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug((string) env('APP_NAME', 'laravel')).'-session'
    ),

    /*
    |--------------------------------------------------------------------------
    | Caminho do Cookie de Sessão
    |--------------------------------------------------------------------------
    |
    | O caminho do cookie de sessão determina o caminho para o qual o cookie
    | será considerado disponível. Normalmente será o caminho raiz da sua
    | aplicação, mas você pode mudar se necessário.
    |
    */

    'path' => env('SESSION_PATH', '/'),

    /*
    |--------------------------------------------------------------------------
    | Domínio do Cookie de Sessão
    |--------------------------------------------------------------------------
    |
    | Este valor determina o domínio e subdomínios para os quais o cookie de
    | sessão está disponível. Por padrão, ficará disponível para o domínio raiz
    | sem subdomínios. Normalmente não deve ser alterado.
    |
    */

    'domain' => env('SESSION_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | Apenas Cookies HTTPS
    |--------------------------------------------------------------------------
    |
    | Ao definir esta opção como true, os cookies de sessão só serão enviados
    | de volta ao servidor se o navegador tiver conexão HTTPS. Isso evita que
    | o cookie seja enviado quando não puder ser feito de forma segura.
    |
    */

    'secure' => env('SESSION_SECURE_COOKIE'),

    /*
    |--------------------------------------------------------------------------
    | Apenas Acesso HTTP
    |--------------------------------------------------------------------------
    |
    | Definir este valor como true impedirá que o JavaScript acesse o valor
    | do cookie e ele só será acessível via protocolo HTTP. É improvável que
    | você deva desativar esta opção.
    |
    */

    'http_only' => env('SESSION_HTTP_ONLY', true),

    /*
    |--------------------------------------------------------------------------
    | Cookies Same-Site
    |--------------------------------------------------------------------------
    |
    | Esta opção determina como seus cookies se comportam em requisições
    | cross-site e pode ser usada para mitigar ataques CSRF. Por padrão,
    | definimos como "lax" para permitir requisições cross-site seguras.
    |
    | Veja: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
    |
    | Suportados: "lax", "strict", "none", null
    |
    */

    'same_site' => env('SESSION_SAME_SITE', 'lax'),

    /*
    |--------------------------------------------------------------------------
    | Cookies Particionados
    |--------------------------------------------------------------------------
    |
    | Definir este valor como true vinculará o cookie ao site de nível superior
    | para um contexto cross-site. Cookies particionados são aceitos pelo
    | navegador quando marcados como "secure" e o atributo Same-Site é "none".
    |
    */

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

    /*
    |--------------------------------------------------------------------------
    | Serialização da Sessão
    |--------------------------------------------------------------------------
    |
    | Este valor controla a estratégia de serialização dos dados da sessão, que
    | é JSON por padrão. Definir como "php" permite armazenar objetos PHP na
    | sessão, mas pode tornar a aplicação vulnerável a ataques de serialização
    | em cadeia se a APP_KEY for vazada.
    |
    | Suportados: "json", "php"
    |
    */

    'serialization' => 'json',

];
