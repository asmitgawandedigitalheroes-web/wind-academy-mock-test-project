-- Fix: notify_admin_on_essay_submission trigger was SECURITY INVOKER (default),
-- causing "permission denied for table users" when an authenticated user submits
-- an essay test. SECURITY DEFINER allows it to access auth.users as the function owner.

CREATE OR REPLACE FUNCTION notify_admin_on_essay_submission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'under_review' THEN
        INSERT INTO notifications (user_id, type, title, message)
        SELECT id, 'admin_action', 'Essay Submitted', 'A student has submitted an essay for review.'
        FROM auth.users
        WHERE raw_user_meta_data->>'role' = 'admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Also fix: trigger_send_essay_email needs SECURITY DEFINER to insert into 
-- notifications table for students when an admin grades their essay.

CREATE OR REPLACE FUNCTION trigger_send_essay_email()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'graded' AND (OLD.status IS NULL OR OLD.status != 'graded') THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (NEW.user_id, 'test_result', 'Essay Result Available', 
               'Your essay for ' || (SELECT title FROM test_sets WHERE id = NEW.test_set_id) || ' has been graded.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
