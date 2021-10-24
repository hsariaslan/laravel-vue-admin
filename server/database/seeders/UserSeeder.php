<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'username'  => 'admin',
            'email'     => 'admin@laravel.com',
            'password'  =>  Hash::make('123456'),
            'name'      => 'Admin',
            'surname'   => 'Sariaslan',
        ]);

        User::create([
            'username'  => 'editor',
            'email'     => 'editor@laravel.com',
            'password'  =>  Hash::make('123456'),
            'name'      => 'Editor',
            'surname'   => 'Sariaslan',
        ]);

        User::create([
            'username'  => 'member',
            'email'     => 'member@laravel.com',
            'password'  =>  Hash::make('123456'),
            'name'      => 'Member',
            'surname'   => 'Sariaslan',
        ]);
    }
}
