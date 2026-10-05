USE fitness_booking_db;

DROP FUNCTION IF EXISTS get_available_seats;

DELIMITER $$

CREATE FUNCTION get_available_seats(
    p_class_id BIGINT
)
    RETURNS INT
    DETERMINISTIC
    READS SQL DATA
BEGIN
    DECLARE v_available_seats INT;

SELECT available_seats
INTO v_available_seats
FROM classes
WHERE id = p_class_id;

RETURN COALESCE(v_available_seats, 0);
END$$

DELIMITER ;