USE fitness_booking_db;

DROP PROCEDURE IF EXISTS book_class;

DELIMITER $$

CREATE PROCEDURE book_class(
    IN p_member_id BIGINT,
    IN p_class_id BIGINT
)
BEGIN
    DECLARE v_available_seats INT;
    DECLARE v_booking_exists INT;

    -- Check whether the member already booked this class
SELECT COUNT(*)
INTO v_booking_exists
FROM class_bookings
WHERE member_id = p_member_id
  AND class_id = p_class_id
  AND status = 'CONFIRMED';

IF v_booking_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Member has already booked this class';
END IF;

    -- Get available seats
SELECT available_seats
INTO v_available_seats
FROM classes
WHERE id = p_class_id;

-- Check class availability
IF v_available_seats IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Class not found';
END IF;

    IF v_available_seats <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No seats available';
END IF;

    -- Create booking
INSERT INTO class_bookings
(member_id, class_id, status)
VALUES
    (p_member_id, p_class_id, 'CONFIRMED');

-- Reduce available seats
UPDATE classes
SET available_seats = available_seats - 1
WHERE id = p_class_id;
END$$

DELIMITER ;