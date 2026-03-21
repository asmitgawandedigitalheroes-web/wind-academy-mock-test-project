-- Set word limits for all essay questions in the bank.
-- max_length: 1000 words (hard limit enforced in the student UI)
-- min_length: 200 words (soft minimum — a reminder shown to students)
UPDATE questions
SET max_length = 1000,
    min_length = 200
WHERE question_type = 'essay';
