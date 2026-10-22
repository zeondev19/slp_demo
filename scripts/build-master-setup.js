// database/build-master-setup.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
const lessons1000SQL = fs.readFileSync(path.join(__dirname, 'seed-1000-lessons.sql'), 'utf8');

// Extract parts from seed.sql:
// Part A: Users and Curriculums (before line "Lessons (100 total)")
const lessonsMarker = '-- Lessons (100 total)';
const stepsMarker = '-- Curriculum Steps (50 total';

const usersAndCurriculums = seedSQL.slice(0, seedSQL.indexOf(lessonsMarker));
const stepsAndBeyond = seedSQL.slice(seedSQL.indexOf(stepsMarker));

// Assemble unified master SQL
let masterSQL = `-- ============================================================
-- The SLP Curriculum: Master Database Setup
-- Target: MySQL 8.0+ / MariaDB (Rumahweb cPanel)
-- Complete setup: Drops old tables, creates schema, seeds 1,000 lessons
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

`;

// Append schema (without duplicate SET NAMES or SET FOREIGN_KEY_CHECKS)
masterSQL += schemaSQL;
masterSQL += '\n\n-- ============================================================\n';
masterSQL += '-- INITIAL SEED DATA\n';
masterSQL += '-- ============================================================\n\n';

// Append Users and Curriculums
masterSQL += usersAndCurriculums;

// Append the 1,000 lessons
masterSQL += '\n-- ============================================================\n';
masterSQL += '-- ALL 1,000 SPEECH THERAPY LESSONS\n';
masterSQL += '-- ============================================================\n\n';
masterSQL += lessons1000SQL;

// Append Curriculum Steps, Playlists, Favorites, Progress, Saved Filters
masterSQL += '\n-- ============================================================\n';
masterSQL += '-- CURRICULUM STEPS, PLAYLISTS, FAVORITES & PROGRESS\n';
masterSQL += '-- ============================================================\n\n';
masterSQL += stepsAndBeyond;

masterSQL += '\n\nSET FOREIGN_KEY_CHECKS = 1;\n';

fs.writeFileSync(path.join(__dirname, 'master-setup.sql'), masterSQL, 'utf8');
console.log('Successfully generated unified database/master-setup.sql!');
