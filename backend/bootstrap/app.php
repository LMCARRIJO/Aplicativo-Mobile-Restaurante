<?php

<<<<<<< HEAD
use App\Http\Middleware\EnsureRole;
=======
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
<<<<<<< HEAD
        $middleware->redirectGuestsTo(null);

        $middleware->alias([
            'role' => EnsureRole::class,
        ]);
=======
        //
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
