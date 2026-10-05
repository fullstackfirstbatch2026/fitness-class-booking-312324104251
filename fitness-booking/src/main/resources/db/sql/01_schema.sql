-- ==========================================
-- FITNESS CLASS BOOKING SYSTEM
-- DATABASE SCHEMA
-- ==========================================

USE fitness_booking_db;


-- ==========================================
-- 1. MEMBERS
-- ==========================================

CREATE TABLE members (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,

                         name VARCHAR(100) NOT NULL,

                         email VARCHAR(150) NOT NULL UNIQUE,

                         phone VARCHAR(20) NOT NULL UNIQUE,

                         membership_type VARCHAR(50) NOT NULL,

                         join_date DATE NOT NULL,

                         status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP
);


-- ==========================================
-- 2. TRAINERS
-- ==========================================

CREATE TABLE trainers (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,

                          name VARCHAR(100) NOT NULL,

                          email VARCHAR(150) NOT NULL UNIQUE,

                          phone VARCHAR(20) NOT NULL UNIQUE,

                          specialization VARCHAR(100) NOT NULL,

                          experience_years INT NOT NULL,

                          status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
);


-- ==========================================
-- 3. CLASSES
-- ==========================================

CREATE TABLE classes (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,

                         class_name VARCHAR(100) NOT NULL,

                         description VARCHAR(500),

                         trainer_id BIGINT NOT NULL,

                         schedule_date DATE NOT NULL,

                         start_time TIME NOT NULL,

                         end_time TIME NOT NULL,

                         capacity INT NOT NULL,

                         available_seats INT NOT NULL,

                         status VARCHAR(20) NOT NULL DEFAULT 'OPEN',

                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_classes_trainer
                             FOREIGN KEY (trainer_id)
                                 REFERENCES trainers(id),

                         CONSTRAINT chk_class_capacity
                             CHECK (capacity > 0),

                         CONSTRAINT chk_available_seats
                             CHECK (available_seats >= 0),

                         CONSTRAINT chk_class_time
                             CHECK (end_time > start_time)
);


-- ==========================================
-- 4. CLASS BOOKINGS
-- ==========================================

CREATE TABLE class_bookings (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                member_id BIGINT NOT NULL,

                                class_id BIGINT NOT NULL,

                                booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',

                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

                                CONSTRAINT fk_bookings_member
                                    FOREIGN KEY (member_id)
                                        REFERENCES members(id),

                                CONSTRAINT fk_bookings_class
                                    FOREIGN KEY (class_id)
                                        REFERENCES classes(id),

                                CONSTRAINT uk_member_class
                                    UNIQUE (member_id, class_id)
);