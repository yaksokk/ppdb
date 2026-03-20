<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            JalurMasukSeeder::class,
            AdminSeeder::class,
            SettingSeeder::class,
            KriteriaSeeder::class,
        ]);
    }
}
