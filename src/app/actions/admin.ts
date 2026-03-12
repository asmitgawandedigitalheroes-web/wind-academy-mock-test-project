'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSubject(formData: { name: string, categoryId: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subjects')
    .insert([{
      name: formData.name,
      category_id: formData.categoryId
    }])

  if (error) {
    console.error('Error adding subject:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function addQuestion(formData: {
  subjectId: string,
  question_text: string,
  options: string[],
  correct_option_index: number,
  explanation?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .insert([{
      subject_id: formData.subjectId,
      question_text: formData.question_text,
      options: formData.options,
      correct_option_index: formData.correct_option_index,
      explanation: formData.explanation
    }])

  if (error) {
    console.error('Error adding question:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function getStats() {
  const supabase = await createClient()

  const [subjectsCount, questionsCount] = await Promise.all([
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true })
  ])

  return {
    subjects: subjectsCount.count || 0,
    questions: questionsCount.count || 0
  }
}

export async function getCategories() {
    const supabase = await createClient()
    const { data } = await supabase.from('categories').select('*').order('name')
    return data || []
}

export async function getSubjectsWithCategories() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('subjects')
        .select('id, name, categories(id, name)')
        .order('name')
    return (data || []) as any[]
}
export async function getTestsBySubject(subjectId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('test_sets')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false })
    return data || []
}

export async function addTest(formData: { title: string, subjectId: string, duration: number, testType?: 'short' | 'full' }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('test_sets')
    .insert([{
      title: formData.title,
      subject_id: formData.subjectId,
      time_limit_minutes: formData.duration,
      test_type: formData.testType || 'full'
    }])

  if (error) {
    console.error('Error adding test:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/subjects/${formData.subjectId}`)
  return { success: true }
}

export async function getSubjectDetails(subjectId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('subjects')
        .select('*, categories(name)')
        .eq('id', subjectId)
        .single()
    return data
}
export async function addQuestionToTest(formData: {
  testSetId: string,
  subjectId: string,
  question_text: string,
  question_type: 'single' | 'multiple',
  options: string[],
  correct_options: number[],
  explanation?: string
}) {
  const supabase = await createClient()

  // 1. Create the question
  const { data: questionData, error: questionError } = await supabase
    .from('questions')
    .insert([{
      subject_id: formData.subjectId,
      question_text: formData.question_text,
      question_type: formData.question_type,
      options: formData.options,
      correct_options: formData.correct_options,
      correct_option_index: formData.question_type === 'single' ? formData.correct_options[0] : null,
      explanation: formData.explanation
    }])
    .select()
    .single()

  if (questionError) {
    console.error('Error adding question:', questionError)
    return { error: questionError.message }
  }

  // 2. Link it to the test set
  const { error: linkError } = await supabase
    .from('test_questions')
    .insert([{
      test_set_id: formData.testSetId,
      question_id: questionData.id
    }])

  if (linkError) {
    console.error('Error linking question to test:', linkError)
    return { error: linkError.message }
  }

  revalidatePath(`/admin/tests/${formData.testSetId}`)
  return { success: true }
}

export async function getQuestionsByTest(testSetId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('test_questions')
        .select(`
            sort_order,
            questions (*)
        `)
        .eq('test_set_id', testSetId)
        .order('sort_order')
    
    return (data || []).map(item => item.questions)
}

export async function getTestDetails(testId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('test_sets')
        .select('*, subjects(id, name, categories(name))')
        .eq('id', testId)
        .single()
    return data
}

export async function updateQuestion(questionId: string, testSetId: string, formData: {
  question_text: string,
  question_type: 'single' | 'multiple',
  options: string[],
  correct_options: number[],
  explanation?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .update({
      question_text: formData.question_text,
      question_type: formData.question_type,
      options: formData.options,
      correct_options: formData.correct_options,
      correct_option_index: formData.question_type === 'single' ? formData.correct_options[0] : null,
      explanation: formData.explanation
    })
    .eq('id', questionId)

  if (error) {
    console.error('Error updating question:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/tests/${testSetId}`)
  return { success: true }
}

export async function deleteQuestion(questionId: string, testSetId: string) {
  const supabase = await createClient()

  await supabase.from('test_questions').delete().eq('question_id', questionId)

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    console.error('Error deleting question:', error)
    return { error: error.message }
  }

  revalidatePath(`/admin/tests/${testSetId}`)
  return { success: true }
}

export async function getCourses() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data || []
}

export async function addCourse(formData: { title: string, description: string, image_url?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('courses')
    .insert([{
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url
    }])

  if (error) {
    console.error('Error adding course:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function getCourseDetails(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getCourseSubjects(courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('course_subjects')
    .select('*, subjects(*, categories(*))')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
  
  return data || []
}

export async function addSubjectToCourse(courseId: string, subjectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('course_subjects')
    .insert([{ course_id: courseId, subject_id: subjectId }])
  
  if (error) {
    console.error('Error adding subject to course:', error)
    return { error: error.message }
  }
  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function removeSubjectFromCourse(courseId: string, subjectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('course_subjects')
    .delete()
    .match({ course_id: courseId, subject_id: subjectId })

  if (error) {
    console.error('Error removing subject:', error)
    return { error: error.message }
  }
  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function bulkUploadQuestions(testSetId: string, subjectId: string, csvContent: string) {
  const supabase = await createClient()
  
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim())
  if (lines.length <= 1) return { error: 'CSV is empty or only contains header' }

  // Simple CSV parser function to handle quoted strings
  const parseCSVLine = (line: string) => {
    const result = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim())
        cur = ''
      } else {
        cur += char
      }
    }
    result.push(cur.trim())
    return result.map(s => s.replace(/^"|"$/g, ''))
  }

  // Skip header
  const dataLines = lines.slice(1)
  let successCount = 0
  let errorCount = 0

  for (const line of dataLines) {
    try {
      const parts = parseCSVLine(line)
      if (parts.length < 4) continue

      const [qText, qType, optsStr, correctsStr, expl] = parts
      
      const options = optsStr.split('|').map(o => o.trim())
      const correctOptions = correctsStr.split('|').map(c => parseInt(c.trim()))

      // 1. Create Question
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .insert([{
          subject_id: subjectId,
          question_text: qText,
          question_type: qType as 'single' | 'multiple',
          options: options,
          correct_options: correctOptions,
          correct_option_index: qType === 'single' ? correctOptions[0] : null,
          explanation: expl || null
        }])
        .select()
        .single()

      if (qError || !qData) {
        console.error('Error inserting question from CSV:', qError)
        errorCount++
        continue
      }

      // 2. Link to Test Set
      const { error: linkError } = await supabase
        .from('test_questions')
        .insert([{
          test_set_id: testSetId,
          question_id: qData.id
        }])

      if (linkError) {
        console.error('Error linking question from CSV:', linkError)
        errorCount++
      } else {
        successCount++
      }
    } catch (err) {
      console.error('Error processing CSV line:', err)
      errorCount++
    }
  }

  revalidatePath(`/admin/tests/${testSetId}`)
  return { success: true, successCount, errorCount }
}
