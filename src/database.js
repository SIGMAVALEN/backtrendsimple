import { Pool } from "pg";

import { config } from "./config.js";




export const pool = new Pool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  port: config.dbPort,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export const initializeDatabase = async () => {
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
};


initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error.message);
});