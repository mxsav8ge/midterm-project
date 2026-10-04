<?php

namespace App\Console\Commands;

class StartCommand extends DevCommand
{
    protected $signature = 'start {--host=0.0.0.0} {--port=8000}';
    protected $description = 'Alias for php artisan dev: starts both backend and frontend';
}
