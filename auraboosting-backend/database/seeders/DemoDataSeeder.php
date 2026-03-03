<?php

namespace Database\Seeders;

use App\Models\CoachSpecialization;
use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@auraboosting.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Create Games
        $games = [
            [
                'name' => 'League of Legends',
                'description' => 'MOBA competitivo 5v5',
                'image' => 'https://example.com/lol.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Valorant',
                'description' => 'FPS táctico 5v5',
                'image' => 'https://example.com/valorant.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Fortnite',
                'description' => 'Battle Royale',
                'image' => 'https://example.com/fortnite.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'CS2',
                'description' => 'FPS competitivo',
                'image' => 'https://example.com/cs2.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($games as $gameData) {
            Game::create($gameData);
        }

        // Create Coaches
        $coaches = [
            [
                'name' => 'Coach Pro',
                'email' => 'coach1@auraboosting.com',
                'password' => Hash::make('password'),
                'role' => 'coach',
                'bio' => 'Jugador profesional con 5 años de experiencia',
                'rating' => 4.8,
                'is_verified' => true,
                'experience_years' => 5,
                'specialties' => ['Mid Lane', 'Jungle'],
            ],
            [
                'name' => 'Coach Elite',
                'email' => 'coach2@auraboosting.com',
                'password' => Hash::make('password'),
                'role' => 'coach',
                'bio' => 'Ex-profesional de Valorant',
                'rating' => 4.9,
                'is_verified' => true,
                'experience_years' => 3,
                'specialties' => ['Duelist', 'Controller'],
            ],
        ];

        foreach ($coaches as $coachData) {
            $coach = User::create($coachData);

            // Add specializations
            if ($coach->name === 'Coach Pro') {
                CoachSpecialization::create([
                    'coach_id' => $coach->id,
                    'game_id' => 1, // League of Legends
                    'level' => 'expert',
                ]);
            } else {
                CoachSpecialization::create([
                    'coach_id' => $coach->id,
                    'game_id' => 2, // Valorant
                    'level' => 'expert',
                ]);
            }
        }

        // Create Students
        $students = [
            [
                'name' => 'Student One',
                'email' => 'student1@example.com',
                'password' => Hash::make('password'),
                'role' => 'student',
            ],
            [
                'name' => 'Student Two',
                'email' => 'student2@example.com',
                'password' => Hash::make('password'),
                'role' => 'student',
            ],
        ];

        foreach ($students as $studentData) {
            User::create($studentData);
        }

        $this->command->info('✅ Demo data created successfully!');
        $this->command->info('📧 Admin: admin@auraboosting.com');
        $this->command->info('📧 Coach 1: coach1@auraboosting.com');
        $this->command->info('📧 Coach 2: coach2@auraboosting.com');
        $this->command->info('📧 Student 1: student1@example.com');
        $this->command->info('🔑 All passwords: password');
    }
}
