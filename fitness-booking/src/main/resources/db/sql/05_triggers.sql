USE fitness_booking_db;

DROP TRIGGER IF EXISTS after_booking_insert;

DELIMITER $$

CREATE TRIGGER after_booking_insert
    AFTER INSERT ON class_bookings
    FOR EACH ROW
BEGIN

    IF NEW.status = 'CONFIRMED' THEN

    UPDATE classes
    SET available_seats = available_seats - 1
    WHERE id = NEW.class_id
      AND available_seats > 0;

END IF;

END$$

DELIMITER ;