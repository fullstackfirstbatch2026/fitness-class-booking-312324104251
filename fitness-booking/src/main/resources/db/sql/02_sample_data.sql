USE fitness_booking_db;


-- ==========================================
-- 1. MEMBERS
-- ==========================================

INSERT INTO members
(name, email, phone, membership_type, join_date, status)
VALUES
    ('Arun Kumar', 'arun@gmail.com', '9876543210', 'PREMIUM', '2026-01-10', 'ACTIVE'),

    ('Priya Sharma', 'priya@gmail.com', '9876543211', 'STANDARD', '2026-02-15', 'ACTIVE'),

    ('Rahul Raj', 'rahul@gmail.com', '9876543212', 'PREMIUM', '2026-03-01', 'ACTIVE'),

    ('Divya Sri', 'divya@gmail.com', '9876543213', 'STANDARD', '2026-03-20', 'ACTIVE'),

    ('Karthik M', 'karthik@gmail.com', '9876543214', 'PREMIUM', '2026-04-05', 'ACTIVE');


-- ==========================================
-- 2. TRAINERS
-- ==========================================

INSERT INTO trainers
(name, email, phone, specialization, experience_years, status)
VALUES
    ('Vikram Singh', 'vikram@fitness.com', '9000000001', 'Strength Training', 8, 'ACTIVE'),

    ('Anjali Menon', 'anjali@fitness.com', '9000000002', 'Yoga', 6, 'ACTIVE'),

    ('Suresh Kumar', 'suresh@fitness.com', '9000000003', 'Cardio', 5, 'ACTIVE'),

    ('Meena Raj', 'meena@fitness.com', '9000000004', 'Zumba', 4, 'ACTIVE');


-- ==========================================
-- 3. CLASSES
-- ==========================================

INSERT INTO classes
(class_name,
 description,
 trainer_id,
 schedule_date,
 start_time,
 end_time,
 capacity,
 available_seats,
 status)
VALUES

    (
        'Strength Training',
        'Full body strength and resistance workout',
        1,
        '2026-10-05',
        '07:00:00',
        '08:00:00',
        10,
        10,
        'OPEN'
    ),

    (
        'Morning Yoga',
        'Beginner friendly yoga and flexibility training',
        2,
        '2026-10-05',
        '08:00:00',
        '09:00:00',
        15,
        15,
        'OPEN'
    ),

    (
        'Cardio Blast',
        'High intensity cardio workout',
        3,
        '2026-10-06',
        '06:00:00',
        '07:00:00',
        8,
        8,
        'OPEN'
    ),

    (
        'Zumba Fitness',
        'Dance based fitness class',
        4,
        '2026-10-06',
        '17:00:00',
        '18:00:00',
        12,
        12,
        'OPEN'
    ),

    (
        'Advanced Strength',
        'Advanced resistance and strength workout',
        1,
        '2026-10-07',
        '18:00:00',
        '19:00:00',
        5,
        5,
        'OPEN'
    );