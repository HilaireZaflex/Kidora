<?php

use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;

require dirname(__DIR__, 2).'/vendor/autoload.php';
$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

if (PHP_SAPI !== 'cli' || ! $app->environment('testing') || config('database.default') !== 'pgsql'
    || config('database.connections.pgsql.database') !== 'kidora_test') {
    throw new LogicException('Browser fixtures require the isolated kidora_test database.');
}
$password = trim(stream_get_contents(STDIN));
if (strlen($password) < 32) {
    throw new LogicException('A random per-run test password is required on stdin.');
}
Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true, '--no-interaction' => true]);
foreach (['writer', 'reviewer', 'editor'] as $role) {
    $user = new User(['name' => 'Test '.$role, 'email' => $role.'@example.test', 'password' => $password]);
    $user->role = $role;
    $user->save();
}
echo "Isolated browser fixtures prepared.\n";
