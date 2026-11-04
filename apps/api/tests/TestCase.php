<?php

namespace Tests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use LogicException;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): Application
    {
        $app = parent::createApplication();

        if (! $app->environment('testing') || $app['config']->get('database.default') !== 'pgsql'
            || $app['config']->get('database.connections.pgsql.database') !== 'kidora_test') {
            throw new LogicException('Tests refused: use APP_ENV=testing and the dedicated PostgreSQL database kidora_test.');
        }

        return $app;
    }
}
