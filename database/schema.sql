-- ============================================================
-- The SLP Curriculum — Database Schema
-- Target: MySQL 8.0+
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS slp_saved_filters;
DROP TABLE IF EXISTS slp_user_progress;
DROP TABLE IF EXISTS slp_favorites;
DROP TABLE IF EXISTS slp_playlist_items;
DROP TABLE IF EXISTS slp_playlists;
DROP TABLE IF EXISTS slp_curriculum_steps;
DROP TABLE IF EXISTS slp_lessons;
DROP TABLE IF EXISTS slp_curriculums;
DROP TABLE IF EXISTS slp_users;

-- -----------------------------------------------------------
-- 1. slp_users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_users (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    display_name  VARCHAR(100)  NOT NULL,
    full_name     VARCHAR(100)  NULL,
    role          ENUM('member','admin','slp') NOT NULL DEFAULT 'member',
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 2. slp_curriculums
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_curriculums (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)  NOT NULL,
    domain      ENUM('Language','Articulation','Pragmatics','Fluency','Phonology') NOT NULL,
    description TEXT,
    target      VARCHAR(100)  NULL,
    level       VARCHAR(50)   NULL,
    thumbnail_url VARCHAR(500) NULL,
    total_steps INT           NOT NULL DEFAULT 0,
    sort_order  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 3. slp_lessons
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_lessons (
    id                INT           AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(300)  NOT NULL,
    description       TEXT,
    curriculum_id     INT           NULL,
    primary_skill     VARCHAR(100),
    secondary_skill   VARCHAR(100),
    domain            ENUM('Language','Articulation','Pragmatics','Fluency','Phonology') NOT NULL,
    target            VARCHAR(100),
    level             ENUM('Isolation','Syllable','Word','Phrase','Sentence','Conversation') NOT NULL,
    activity_format   ENUM('Interactive Genially Deck','Printable Worksheet','Teaching Script','Flashcards','Assessment') NOT NULL,
    topic             VARCHAR(100),
    genially_embed_url TEXT,
    teaching_script   TEXT,
    thumbnail_url     VARCHAR(500),
    duration_minutes  INT           NOT NULL DEFAULT 15,
    materials         TEXT,
    objectives        TEXT,
    preparation_notes TEXT,
    times_used        INT           NOT NULL DEFAULT 0,
    sort_order        INT           NOT NULL DEFAULT 0,
    is_new            BOOLEAN       NOT NULL DEFAULT FALSE,
    popularity_score  INT           NOT NULL DEFAULT 0,
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_curriculum
        FOREIGN KEY (curriculum_id) REFERENCES slp_curriculums(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes on slp_lessons
CREATE INDEX idx_lessons_domain       ON slp_lessons(domain);
CREATE INDEX idx_lessons_target       ON slp_lessons(target);
CREATE INDEX idx_lessons_level        ON slp_lessons(level);
CREATE INDEX idx_lessons_primary_skill ON slp_lessons(primary_skill);

-- -----------------------------------------------------------
-- 4. slp_curriculum_steps
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_curriculum_steps (
    id                     INT  AUTO_INCREMENT PRIMARY KEY,
    curriculum_id          INT  NOT NULL,
    lesson_id              INT  NOT NULL,
    step_number            INT  NOT NULL,
    suggested_next_lesson_id INT NULL,

    UNIQUE KEY uq_curriculum_step (curriculum_id, step_number),

    CONSTRAINT fk_steps_curriculum
        FOREIGN KEY (curriculum_id) REFERENCES slp_curriculums(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_steps_lesson
        FOREIGN KEY (lesson_id) REFERENCES slp_lessons(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_steps_next_lesson
        FOREIGN KEY (suggested_next_lesson_id) REFERENCES slp_lessons(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index on slp_curriculum_steps
CREATE INDEX idx_steps_curriculum ON slp_curriculum_steps(curriculum_id);

-- -----------------------------------------------------------
-- 5. slp_playlists
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_playlists (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    user_id     INT           NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    description TEXT,
    is_default  BOOLEAN       NOT NULL DEFAULT FALSE,
    sort_order  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlists_user
        FOREIGN KEY (user_id) REFERENCES slp_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index on slp_playlists
CREATE INDEX idx_playlists_user ON slp_playlists(user_id);

-- -----------------------------------------------------------
-- 6. slp_playlist_items
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_playlist_items (
    id          INT       AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT       NOT NULL,
    lesson_id   INT       NOT NULL,
    sort_order  INT       NOT NULL DEFAULT 0,
    notes       TEXT,
    added_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_playlist_lesson (playlist_id, lesson_id),

    CONSTRAINT fk_pitems_playlist
        FOREIGN KEY (playlist_id) REFERENCES slp_playlists(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_pitems_lesson
        FOREIGN KEY (lesson_id) REFERENCES slp_lessons(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 7. slp_favorites
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_favorites (
    id         INT       AUTO_INCREMENT PRIMARY KEY,
    user_id    INT       NOT NULL,
    lesson_id  INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_user_lesson_fav (user_id, lesson_id),

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id) REFERENCES slp_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_favorites_lesson
        FOREIGN KEY (lesson_id) REFERENCES slp_lessons(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index on slp_favorites
CREATE INDEX idx_favorites_user ON slp_favorites(user_id);

-- -----------------------------------------------------------
-- 8. slp_user_progress
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_user_progress (
    id             INT       AUTO_INCREMENT PRIMARY KEY,
    user_id        INT       NOT NULL,
    lesson_id      INT       NOT NULL,
    curriculum_id  INT       NULL,
    last_opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    times_opened   INT       NOT NULL DEFAULT 1,
    completed      BOOLEAN   NOT NULL DEFAULT FALSE,

    UNIQUE KEY uq_user_lesson_prog (user_id, lesson_id),

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id) REFERENCES slp_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_progress_lesson
        FOREIGN KEY (lesson_id) REFERENCES slp_lessons(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_progress_curriculum
        FOREIGN KEY (curriculum_id) REFERENCES slp_curriculums(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index on slp_user_progress
CREATE INDEX idx_progress_user ON slp_user_progress(user_id);

-- -----------------------------------------------------------
-- 9. slp_saved_filters
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS slp_saved_filters (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    user_id     INT           NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    filters     JSON          NULL,
    filter_json JSON          NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_filters_user
        FOREIGN KEY (user_id) REFERENCES slp_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
