-- Add 'essay' to test_type if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'test_type') THEN
        CREATE TYPE test_type AS ENUM ('short', 'full', 'essay');
    ELSE
        -- Alter existing type if possible, or just add the value
        ALTER TYPE test_type ADD VALUE IF NOT EXISTS 'essay';
    END IF;
END $$;

-- Add status to test_results to handle manual grading
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'result_status') THEN
        CREATE TYPE result_status AS ENUM ('completed', 'under_review', 'graded');
    END IF;
END $$;

ALTER TABLE test_results ADD COLUMN IF NOT EXISTS status result_status DEFAULT 'completed';
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS graded_by UUID REFERENCES auth.users(id);

-- Update student_answers to support long text for essay
ALTER TABLE student_answers ADD COLUMN IF NOT EXISTS essay_answer TEXT;

-- Create a table for essay questions bank if needed, 
-- but for now we'll just use the questions table with a new type
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
        CREATE TYPE question_type AS ENUM ('single', 'multiple', 'essay');
    ELSE
        ALTER TYPE question_type ADD VALUE IF NOT EXISTS 'essay';
    END IF;
END $$;

-- Ensure questions table has the type
ALTER TABLE questions ALTER COLUMN question_type TYPE TEXT; -- Convert to text first if it was enum to avoid issues, or just use the enum
-- Actually, the schema saw it as TEXT earlier.

-- Notification for when a test is submitted for review
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_essay_submission ON test_results;
CREATE TRIGGER on_essay_submission
    AFTER INSERT OR UPDATE ON test_results
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_on_essay_submission();
