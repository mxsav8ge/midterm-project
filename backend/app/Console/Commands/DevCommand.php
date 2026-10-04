<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DevCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev {--host=0.0.0.0} {--port=8000} {--same-window}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start both Laravel Backend API and React Native Expo Frontend';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $host = $this->option('host');
        $port = $this->option('port');
        $frontendDir = realpath(base_path('../frontend'));

        $this->info("========================================================");
        $this->info("  🚀 Starting Velvet Brew Ordering System (Full Stack)  ");
        $this->info("========================================================");
        $this->line("• Backend API:  <fg=cyan>http://{$host}:{$port}/api</>");
        $this->line("• Frontend Dir: <fg=yellow>{$frontendDir}</>");
        $this->newLine();

        if (PHP_OS_FAMILY === 'Windows') {
            $this->info("⚡ Launching Expo Frontend in companion terminal window...");
            // Opens Expo in an interactive terminal window so the QR code and shortcuts ('w', 'a', 'r') work smoothly
            pclose(popen("start \"Expo Mobile Frontend - Velvet Brew\" cmd /c \"cd /d \"{$frontendDir}\" && npx expo start\"", "r"));
        } else {
            $this->info("⚡ Launching Expo Frontend in background...");
            exec("cd \"{$frontendDir}\" && npx expo start > /dev/null 2>&1 &");
        }

        $this->info("⚡ Starting Laravel API Server on {$host}:{$port}...");
        $this->newLine();

        // Run artisan serve in this window
        $this->call('serve', [
            '--host' => $host,
            '--port' => $port,
        ]);

        return Command::SUCCESS;
    }
}
