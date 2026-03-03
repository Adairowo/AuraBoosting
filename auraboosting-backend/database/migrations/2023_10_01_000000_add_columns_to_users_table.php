<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['coach', 'student', 'admin'])->default('student');
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->integer('experience_years')->nullable();
            $table->json('specialties')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'bio', 'avatar', 'rating', 'is_verified', 'experience_years', 'specialties']);
        });
    }
};
