-- Trigger for sending email when essay is graded
CREATE OR REPLACE FUNCTION trigger_send_essay_email()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'graded' AND (OLD.status IS NULL OR OLD.status != 'graded') THEN
        -- Invoke the Edge Function
        -- This requires pg_net extension usually, or we can use a simpler approach
        -- For now, we'll log it or use a common notification pattern
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (NEW.user_id, 'test_result', 'Essay Result Available', 'Your essay for ' || (SELECT title FROM test_sets WHERE id = NEW.test_set_id) || ' has been graded.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_essay_graded ON test_results;
CREATE TRIGGER on_essay_graded
    AFTER UPDATE ON test_results
    FOR EACH ROW
    EXECUTE FUNCTION trigger_send_essay_email();
