<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\PermissionCategory;
use App\Models\PermissionAction;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Insert permission categories and permission actions
        $permissionCategories = [
            'Dashboard',
            'User',
            'Role',
            'Permission',
            'Permission Categories',
            'Permission Actions',
        ];

        foreach ($permissionCategories as $permissionCategory) {
            PermissionCategory::create([
                'name' =>$permissionCategory,
            ]);
        }

        $permissionActions = [
            'List',
            'Create',
            'Show',
            'Update',
            'Delete',
            'Login',
        ];

        foreach ($permissionActions as $permissionAction) {
            PermissionAction::create([
                'name' =>$permissionAction,
            ]);
        }

        // ------------------------------------------- ADMIN ROLE -------------------------------------------
        // Admin has automatic access to all permissions by Gate::before rule in AuthServiceProvider
        $role1 = Role::create([
            'name'          => 'admin',
            'display_name'  => 'Admin',
            'color'         => 'EF4444FF', // tw-red-500
            'scope'         => 0,
        ]);

        // Insert all permissions to database. Admin has all permissions
        $permissions = [
            // dashboard permissions
            [
                'category_id' => 1,
                'action_id' => 6,
                'display_name' => 'Login To Panel',
            ],
            // dashboard permissions
            [
                'category_id' => 1,
                'action_id' => 3,
                'display_name' => 'Show Dashboard',
            ],

            // user permissions
            [
                'category_id' => 2,
                'action_id' => 1,
                'display_name' => 'List Users',
            ],
            [
                'category_id' => 2,
                'action_id' => 2,
                'display_name' => 'Create User',
            ],
            [
                'category_id' => 2,
                'action_id' => 3,
                'display_name' => 'Show User',
            ],
            [
                'category_id' => 2,
                'action_id' => 4,
                'display_name' => 'Update User',
            ],
            [
                'category_id' => 2,
                'action_id' => 5,
                'display_name' => 'Delete User',
            ],

            // role permissions
            [
                'category_id' => 3,
                'action_id' => 1,
                'display_name' => 'List Roles',
            ],
            [
                'category_id' => 3,
                'action_id' => 2,
                'display_name' => 'Create Role',
            ],
            [
                'category_id' => 3,
                'action_id' => 3,
                'display_name' => 'Show Role',
            ],
            [
                'category_id' => 3,
                'action_id' => 4,
                'display_name' => 'Update Role',
            ],
            [
                'category_id' => 3,
                'action_id' => 5,
                'display_name' => 'Delete Role',
            ],

            // permission permissions
            [
                'category_id' => 4,
                'action_id' => 1,
                'display_name' => 'List Permissions',
            ],
            [
                'category_id' => 4,
                'action_id' => 2,
                'display_name' => 'Create Permission',
            ],
            [
                'category_id' => 4,
                'action_id' => 3,
                'display_name' => 'Show Permission',
            ],
            [
                'category_id' => 4,
                'action_id' => 4,
                'display_name' => 'Update Permission',
            ],
            [
                'category_id' => 4,
                'action_id' => 5,
                'display_name' => 'Delete Permission',
            ],

            // permission category permissions
            [
                'category_id' => 5,
                'action_id' => 1,
                'display_name' => 'List Permission Categories',
            ],
            [
                'category_id' => 5,
                'action_id' => 2,
                'display_name' => 'Create Permission Category',
            ],
            [
                'category_id' => 5,
                'action_id' => 3,
                'display_name' => 'Show Permission Category',
            ],
            [
                'category_id' => 5,
                'action_id' => 4,
                'display_name' => 'Update Permission Category',
            ],
            [
                'category_id' => 5,
                'action_id' => 5,
                'display_name' => 'Delete Permission Category',
            ],

            // permission action permissions
            [
                'category_id' => 6,
                'action_id' => 1,
                'display_name' => 'List Permission Actions',
            ],
            [
                'category_id' => 6,
                'action_id' => 2,
                'display_name' => 'Create Permission Action',
            ],
            [
                'category_id' => 6,
                'action_id' => 3,
                'display_name' => 'Show Permission Action',
            ],
            [
                'category_id' => 6,
                'action_id' => 4,
                'display_name' => 'Update Permission Action',
            ],
            [
                'category_id' => 6,
                'action_id' => 5,
                'display_name' => 'Delete Permission Action',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'category_id'   => $permission['category_id'],
                'action_id'     => $permission['action_id'],
                'name'          => slugify($permission['display_name']),
                'display_name'  => $permission['display_name'],
                'group'         => 'cms',
            ]);
        }

        $user = User::where('id',1)->first();
        $user->assignRole($role1);

        // ------------------------------------------- EDITOR ROLE -------------------------------------------
        $role2 = Role::create([
            'name'          => 'editor',
            'display_name'  => 'Editor',
            'color'         => '10B981FF', // tw-green-500
            'scope'         => 20,
        ]);

        // Editor permissions
        $permissions = [
            // dashboard permissions
            'Login To Panel',
            'Show Dashboard',

            // users permissions
            'List Users',
            'Create User',
            'Show User',
            'Update User',
            'Delete User',

            // roles permissions
           'List Roles',
           'Show Role',
        ];

        foreach ($permissions as $permission) {
            $role2->givePermissionTo(slugify($permission));
        }

        $user = User::where('id',2)->first();
        $user->assignRole($role2);

        // ------------------------------------------- MEMBER ROLE -------------------------------------------
        $role3 = Role::create([
            'name'          => 'member',
            'display_name'  => 'Member',
            'color'         => '3B82F6FF', // tw-blue-500
            'scope'         => 30,
        ]);

        // Member permissions
        $permissions = [
            // dashboard permissions
            'Login To Panel',
            'Show Dashboard',
            
            // users permissions
            'List Users',
            'Show User',
        ];

        foreach ($permissions as $permission) {
            $role3->givePermissionTo(slugify($permission));
        }

        $user = User::where('id',3)->first();
        $user->assignRole($role3);
    }
}
