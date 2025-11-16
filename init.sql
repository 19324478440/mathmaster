-- MathMaster 数据库初始化脚本
-- 请根据你的数据库类型调整语法

CREATE DATABASE IF NOT EXISTS mathmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mathmaster;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    grade VARCHAR(20),
    specialty VARCHAR(100),
    learning_goal VARCHAR(200),
    challenge_direction VARCHAR(200),
    completed_levels INT DEFAULT 0,
    notes_count INT DEFAULT 0,
    consecutive_days INT DEFAULT 0,
    points INT DEFAULT 0,
    last_checkin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户进度表
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    theme VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id, theme, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 心得表
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50),
    likes INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 联系表单表
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入演示用户（可选）
INSERT INTO users (username, password, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points) 
VALUES ('demo', 'demo', '演示用户', '高二', '函数与导数', '冲击高考数学145+', '函数综合题、导数应用', 12, 8, 15, 380)
ON DUPLICATE KEY UPDATE username=username;

