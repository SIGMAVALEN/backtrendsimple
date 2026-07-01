import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config(); // Solo para tu entorno local

// Validamos si la variable existe. Si estás en Vercel y sale este error en los logs, sabremos 100% por qué es.
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR CRÍTICO: La variable DATABASE_URL no está definida en el entorno.");
}

// 🔥 CONEXIÓN DIRECTA POR URI (Recomendada para Vercel + Supabase)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Obligatorio para Supabase en producción
  },
});

export const initializeDatabase = async () => {
  try {
    await pool.query(`
      create table if not exists users (
        id uuid primary key default gen_random_uuid(),
        email text not null unique,
        name text,
        type text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists materias (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        code text unique,
        description text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists materia_profesores (
        materia_id uuid not null references materias (id) on delete cascade,
        user_id uuid not null references users (id) on delete cascade,
        created_at timestamptz not null default now(),
        primary key (materia_id, user_id)
      );

      create table if not exists materia_alumnos (
        materia_id uuid not null references materias (id) on delete cascade,
        user_id uuid not null references users (id) on delete cascade,
        created_at timestamptz not null default now(),
        primary key (materia_id, user_id)
      );
    `);
    console.log("🚀 Base de datos inicializada o verificada correctamente.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
};

initializeDatabase();