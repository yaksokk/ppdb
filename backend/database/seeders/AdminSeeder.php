<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'operator']);
        Role::create(['name' => 'pendaftar']);

        $admin = User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@smpn1tumpaan.sch.id',
            'password' => Hash::make('Admin@1234'),
        ]);
        $admin->assignRole('admin');
    }
}
