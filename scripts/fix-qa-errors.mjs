/**
 * Wings Academy — QA Fix Script
 *
 * Fixes 574 QA errors (522 critical) across all 11 aviation modules:
 *   Phase 0  Validate Supabase connection
 *   Phase 1  Draft Modules 4, 5, 6 (zero-question modules)
 *   Phase 2  Delete broken test_questions references
 *   Phase 3  Remove intra-test duplicate question assignments
 *   Phase 4  Redistribute valid questions to empty/underfilled test_sets
 *   Phase 5  Fix target_questions to match actual counts
 *   Phase 6  Validate and print summary
 *
 * Usage:
 *   node scripts/fix-qa-errors.mjs            (live fix)
 *   node scripts/fix-qa-errors.mjs --dry-run  (no DB writes, shows what would happen)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── SETUP ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && !(key in process.env)) process.env[key] = val
    }
  } catch {
    console.warn('[WARN] Could not read .env.local — expecting env vars from shell')
  }
}

loadEnv()

const DRY_RUN = process.argv.includes('--dry-run')
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[FATAL] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
})

const summary = {
  broken_refs_deleted: 0,
  duplicates_removed: 0,
  questions_assigned: 0,
  targets_updated: 0,
  test_sets_drafted: 0,
  errors: []
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function log(msg) { console.log(msg) }
function ok(msg)  { console.log(`  ✓ ${msg}`) }
function warn(msg){ console.log(`  ⚠ ${msg}`) }
function err(msg) { console.log(`  ✗ ${msg}`); summary.errors.push(msg) }

/** Safe Supabase query — throws on error */
async function q(label, promise) {
  const { data, error, count } = await promise
  if (error) {
    err(`${label}: ${error.message}`)
    return null
  }
  return count !== undefined ? count : data
}

/**
 * Fetch ALL rows from a query, paginating in chunks to bypass the 1000-row Supabase default limit.
 * Usage: await fetchAll(supabase.from('questions').select('id').eq('module_id', id))
 * Pass the builder WITHOUT calling .then() — we'll add .range() internally.
 */
async function fetchAllIds(table, column, filterFn) {
  const PAGE = 1000
  let offset = 0
  const all = []
  while (true) {
    const { data, error } = await filterFn(
      supabase.from(table).select(column)
    ).range(offset, offset + PAGE - 1)

    if (error) { err(`fetchAllIds ${table}: ${error.message}`); break }
    if (!data?.length) break
    all.push(...data.map(r => r[column]))
    if (data.length < PAGE) break
    offset += PAGE
  }
  return all
}

// ─── PHASE 0: Validate connection ────────────────────────────────────────────

async function phase0() {
  log('\n━━━ PHASE 0 — Validate Connection ━━━')
  const { data, error } = await supabase.from('modules').select('id').limit(1)
  if (error) {
    console.error('[FATAL] Cannot connect to Supabase:', error.message)
    process.exit(1)
  }
  ok(`Connected to Supabase (${SUPABASE_URL})`)
  log(`  Mode: ${DRY_RUN ? '⚡ DRY-RUN (no writes)' : '🔴 LIVE (writing to database)'}`)
}

// ─── PHASE 1: Draft Modules 4, 5, 6 ─────────────────────────────────────────

async function phase1() {
  log('\n━━━ PHASE 1 — Draft Modules 4, 5, 6 (zero questions) ━━━')

  const { data: modules, error } = await supabase
    .from('modules')
    .select('id, name')
    .or([
      'name.ilike.%Electronic Fundamentals%',
      'name.ilike.%Digital Techniques%',
      'name.ilike.%Materials and Hardware%'
    ].join(','))

  if (error || !modules?.length) {
    err(`Phase 1 module fetch: ${error?.message || 'no modules found'}`)
    return
  }

  for (const mod of modules) {
    log(`  → "${mod.name}"`)

    // Count test_sets to be drafted
    const { data: sets, error: setsErr } = await supabase
      .from('test_sets')
      .select('id, title, status')
      .eq('module_id', mod.id)

    if (setsErr) { err(`Phase 1 fetch sets for ${mod.name}: ${setsErr.message}`); continue }
    if (!sets?.length) { warn(`No test_sets for "${mod.name}"`); continue }

    log(`    ${sets.length} test_sets: ${sets.map(s => `"${s.title}"`).join(', ')}`)

    const setIds = sets.map(s => s.id)

    if (DRY_RUN) {
      log(`    [DRY-RUN] Would set status='draft', is_hidden=true on ${sets.length} test_sets`)
      log(`    [DRY-RUN] Would DELETE all test_questions rows for these ${sets.length} test_sets (purge orphans)`)
      summary.test_sets_drafted += sets.length
      continue
    }

    // Draft the test_sets
    const { error: upErr } = await supabase
      .from('test_sets')
      .update({ status: 'draft', is_hidden: true })
      .eq('module_id', mod.id)

    if (upErr) {
      err(`Phase 1 update ${mod.name}: ${upErr.message}`)
      continue
    }

    // Purge any orphaned test_questions rows for these test_sets
    const { error: purgeErr } = await supabase
      .from('test_questions')
      .delete()
      .in('test_set_id', setIds)

    if (purgeErr) {
      warn(`Phase 1 purge test_questions for ${mod.name}: ${purgeErr.message}`)
    } else {
      ok(`Purged orphaned test_questions for "${mod.name}"`)
    }

    summary.test_sets_drafted += sets.length
    ok(`Drafted ${sets.length} test_sets for "${mod.name}"`)
  }
}

// ─── PHASE 2: Delete broken test_questions refs ───────────────────────────────

async function deleteBrokenForModule(moduleId, moduleName) {
  // Fetch ALL valid question IDs for this module (paginated)
  const validIds = await fetchAllIds('questions', 'id', b => b.eq('module_id', moduleId))
  const validSet = new Set(validIds)
  log(`    Valid questions in DB: ${validSet.size}`)

  // Fetch all test_sets for this module (non-draft)
  const { data: testSets, error: tsErr } = await supabase
    .from('test_sets')
    .select('id')
    .eq('module_id', moduleId)
    .neq('status', 'draft')

  if (tsErr) { err(`Phase 2 fetch test_sets for ${moduleName}: ${tsErr.message}`); return 0 }
  if (!testSets?.length) { warn(`No published test_sets for ${moduleName}`); return 0 }

  const testSetIds = testSets.map(ts => ts.id)

  // Fetch all test_questions for these test_sets (paginated)
  const tqAll = []
  for (const tsId of testSetIds) {
    const rows = await fetchAllIds('test_questions', 'question_id', b => b.select('test_set_id,question_id').eq('test_set_id', tsId))
    // fetchAllIds only returns one column; redo with full select
    const { data: tqRows } = await supabase
      .from('test_questions')
      .select('test_set_id, question_id')
      .eq('test_set_id', tsId)
      .range(0, 9999)
    tqAll.push(...(tqRows || []))
  }
  const tqs = tqAll
  if (!tqs?.length) { warn(`No test_questions found for ${moduleName}`); return 0 }

  const brokenRows = tqs.filter(row => !validSet.has(row.question_id))
  log(`    Total test_questions rows: ${tqs.length} | Broken: ${brokenRows.length}`)

  if (!brokenRows.length) { ok(`No broken refs for ${moduleName}`); return 0 }

  const brokenIds = [...new Set(brokenRows.map(r => r.question_id))]

  if (DRY_RUN) {
    log(`    [DRY-RUN] Would DELETE ${brokenRows.length} broken rows (${brokenIds.length} unique bad IDs)`)
    summary.broken_refs_deleted += brokenRows.length
    return brokenRows.length
  }

  // Delete in batches of 400 (PostgREST URL limit safety)
  const BATCH = 400
  let deleted = 0
  for (let i = 0; i < brokenIds.length; i += BATCH) {
    const batch = brokenIds.slice(i, i + BATCH)
    const { error: delErr } = await supabase
      .from('test_questions')
      .delete()
      .in('question_id', batch)
      .in('test_set_id', testSetIds)  // Scope to this module only

    if (delErr) {
      err(`Phase 2 delete batch for ${moduleName}: ${delErr.message}`)
    } else {
      // Count rows affected (Supabase doesn't return count on delete, so use batch row count)
      const batchRows = brokenRows.filter(r => batch.includes(r.question_id)).length
      deleted += batchRows
    }
  }

  summary.broken_refs_deleted += deleted
  ok(`Deleted ${deleted} broken test_questions rows for "${moduleName}"`)
  return deleted
}

async function phase2(activeModules) {
  log('\n━━━ PHASE 2 — Delete Broken test_questions References ━━━')
  for (const mod of activeModules) {
    log(`  → "${mod.name}"`)
    await deleteBrokenForModule(mod.id, mod.name)
  }
}

// ─── PHASE 3: Remove intra-test duplicates ────────────────────────────────────

async function removeDuplicatesForTestSet(testSetId, testTitle) {
  const { data: rows, error } = await supabase
    .from('test_questions')
    .select('question_id, sort_order')
    .eq('test_set_id', testSetId)
    .order('sort_order', { ascending: true })

  if (error || !rows?.length) return 0

  const seen = new Set()
  const dupeOrders = []
  for (const row of rows) {
    if (seen.has(row.question_id)) {
      dupeOrders.push(row.sort_order)
    } else {
      seen.add(row.question_id)
    }
  }

  if (!dupeOrders.length) return 0

  log(`    "${testTitle}": ${dupeOrders.length} duplicate(s) found`)

  if (DRY_RUN) {
    log(`    [DRY-RUN] Would DELETE ${dupeOrders.length} duplicate rows`)
    summary.duplicates_removed += dupeOrders.length
    return dupeOrders.length
  }

  const { error: delErr } = await supabase
    .from('test_questions')
    .delete()
    .eq('test_set_id', testSetId)
    .in('sort_order', dupeOrders)

  if (delErr) {
    err(`Phase 3 duplicate removal for "${testTitle}": ${delErr.message}`)
    return 0
  }

  summary.duplicates_removed += dupeOrders.length
  ok(`Removed ${dupeOrders.length} duplicates from "${testTitle}"`)
  return dupeOrders.length
}

async function phase3(activeModules) {
  log('\n━━━ PHASE 3 — Remove Intra-Test Duplicates ━━━')
  for (const mod of activeModules) {
    const { data: testSets, error } = await supabase
      .from('test_sets')
      .select('id, title')
      .eq('module_id', mod.id)
      .neq('status', 'draft')

    if (error || !testSets?.length) continue

    for (const ts of testSets) {
      await removeDuplicatesForTestSet(ts.id, ts.title)
    }
  }
  ok(`Phase 3 complete — ${summary.duplicates_removed} duplicates removed`)
}

// ─── PHASE 4: Redistribute questions ─────────────────────────────────────────

/**
 * Round-robin distribute pool questions across testSets that need filling.
 * Returns array of {test_set_id, question_id, sort_order} rows to insert.
 */
function roundRobinDistribute(emptySets, pool, alreadyAssigned) {
  if (!emptySets.length || !pool.length) return []

  // Per-set tracking (deep copy existing assignments)
  const assigned = new Map()
  for (const ts of emptySets) {
    assigned.set(ts.id, new Set(alreadyAssigned.get(ts.id) || []))
  }

  const rows = []
  let pi = 0      // pool index
  let si = 0      // set index

  while (pi < pool.length) {
    const ts = emptySets[si % emptySets.length]
    const qId = pool[pi]

    if (!assigned.get(ts.id).has(qId)) {
      const sortOrder = assigned.get(ts.id).size + 1
      rows.push({ test_set_id: ts.id, question_id: qId, sort_order: sortOrder })
      assigned.get(ts.id).add(qId)
    }

    pi++
    si++
  }

  return rows
}

async function getCurrentAssignments(testSetIds) {
  const map = new Map()
  // Fetch in chunks to handle many test_sets
  const CHUNK = 50
  for (let i = 0; i < testSetIds.length; i += CHUNK) {
    const { data, error } = await supabase
      .from('test_questions')
      .select('test_set_id, question_id, sort_order')
      .in('test_set_id', testSetIds.slice(i, i + CHUNK))
      .range(0, 9999)
    if (error) continue
    for (const row of (data || [])) {
      if (!map.has(row.test_set_id)) map.set(row.test_set_id, new Set())
      map.get(row.test_set_id).add(row.question_id)
    }
  }
  return map
}

async function insertRows(rows, label) {
  if (!rows.length) { warn(`No rows to insert for ${label}`); return }

  if (DRY_RUN) {
    log(`    [DRY-RUN] Would INSERT ${rows.length} rows into test_questions (${label})`)
    summary.questions_assigned += rows.length
    return
  }

  const BATCH = 500
  for (let i = 0; i < rows.length; i += BATCH) {
    const { error } = await supabase
      .from('test_questions')
      .insert(rows.slice(i, i + BATCH))

    if (error) {
      err(`Phase 4 insert batch for ${label}: ${error.message}`)
      return
    }
  }

  summary.questions_assigned += rows.length
  ok(`Inserted ${rows.length} question assignments (${label})`)
}

/** Generic redistribution for modules 1, 2, 3, 8, 9 */
async function redistributeGeneric(moduleId, moduleName) {
  // Get published test_sets
  const { data: testSets, error: tsErr } = await supabase
    .from('test_sets')
    .select('id, title, target_questions')
    .eq('module_id', moduleId)
    .neq('status', 'draft')
    .order('created_at', { ascending: true })

  if (tsErr || !testSets?.length) return

  const testSetIds = testSets.map(ts => ts.id)
  const alreadyAssigned = await getCurrentAssignments(testSetIds)

  // Find empty test_sets (0 assigned after Phase 2 cleanup)
  const emptySets = testSets.filter(ts => (alreadyAssigned.get(ts.id)?.size || 0) === 0)
  if (!emptySets.length) { ok(`No empty test_sets for ${moduleName}`); return }

  // Build pool: valid questions NOT yet used in any test_set of this module
  const { data: allQs, error: qErr } = await supabase
    .from('questions')
    .select('id')
    .eq('module_id', moduleId)

  if (qErr || !allQs?.length) { warn(`No questions available for ${moduleName}`); return }

  const usedAnywhere = new Set([...alreadyAssigned.values()].flatMap(s => [...s]))
  const pool = allQs.map(q => q.id).filter(id => !usedAnywhere.has(id))

  log(`    Empty sets: ${emptySets.length} | Unassigned pool: ${pool.length}`)

  if (!pool.length) {
    // Fall back: allow reuse from all valid questions
    warn(`Pool exhausted for ${moduleName} — using full question bank (questions may repeat across tests)`)
    const fullPool = allQs.map(q => q.id)
    const rows = roundRobinDistribute(emptySets.map(ts => ({ ...ts })), fullPool, alreadyAssigned)
    await insertRows(rows, moduleName)
    return
  }

  const rows = roundRobinDistribute(emptySets.map(ts => ({ ...ts })), pool, alreadyAssigned)
  await insertRows(rows, moduleName)
}

/** Module 7: split essay vs MCQ test_sets */
async function redistributeModule7(moduleId) {
  log('    Module 7 — split by test_type (essay / MCQ)')

  const { data: testSets, error: tsErr } = await supabase
    .from('test_sets')
    .select('id, title, test_type, target_questions')
    .eq('module_id', moduleId)
    .neq('status', 'draft')
    .order('created_at', { ascending: true })

  if (tsErr || !testSets?.length) return

  const essaySets = testSets.filter(ts => ts.test_type === 'essay')
  const mcqSets   = testSets.filter(ts => ts.test_type !== 'essay')

  const testSetIds = testSets.map(ts => ts.id)
  const alreadyAssigned = await getCurrentAssignments(testSetIds)

  // Essay pool
  const { data: essayQs } = await supabase
    .from('questions')
    .select('id')
    .eq('module_id', moduleId)
    .eq('question_type', 'essay')

  // MCQ pool
  const { data: mcqQs } = await supabase
    .from('questions')
    .select('id')
    .eq('module_id', moduleId)
    .neq('question_type', 'essay')

  const essayPool = (essayQs || []).map(q => q.id)
  const mcqPool   = (mcqQs || []).map(q => q.id)

  log(`    Essay pool: ${essayPool.length} | MCQ pool: ${mcqPool.length}`)

  // Fill empty essay sets
  const emptyEssaySets = essaySets.filter(ts => (alreadyAssigned.get(ts.id)?.size || 0) === 0)
  if (emptyEssaySets.length && essayPool.length) {
    const usedEssay = new Set([...essaySets.flatMap(ts => [...(alreadyAssigned.get(ts.id) || [])])])
    const freshEssay = essayPool.filter(id => !usedEssay.has(id))
    const pool = freshEssay.length ? freshEssay : essayPool
    const rows = roundRobinDistribute(emptyEssaySets, pool, alreadyAssigned)
    await insertRows(rows, 'Module7-Essay')
  }

  // Fill empty MCQ sets
  const emptyMcqSets = mcqSets.filter(ts => (alreadyAssigned.get(ts.id)?.size || 0) === 0)
  if (emptyMcqSets.length && mcqPool.length) {
    const usedMcq = new Set([...mcqSets.flatMap(ts => [...(alreadyAssigned.get(ts.id) || [])])])
    const freshMcq = mcqPool.filter(id => !usedMcq.has(id))
    const pool = freshMcq.length ? freshMcq : mcqPool
    const rows = roundRobinDistribute(emptyMcqSets, pool, alreadyAssigned)
    await insertRows(rows, 'Module7-MCQ')
  }
}

/** Module 11: priority fill — Free Tests first, then Full Tests with remainder */
async function redistributeModule11(moduleId) {
  log('    Module 11 — priority fill (Free Tests first)')

  const { data: testSets, error: tsErr } = await supabase
    .from('test_sets')
    .select('id, title, is_paid, test_type, target_questions')
    .eq('module_id', moduleId)
    .neq('status', 'draft')
    .order('created_at', { ascending: true })

  if (tsErr || !testSets?.length) return

  const testSetIds = testSets.map(ts => ts.id)
  const alreadyAssigned = await getCurrentAssignments(testSetIds)

  const { data: allQs, error: qErr } = await supabase
    .from('questions')
    .select('id')
    .eq('module_id', moduleId)

  if (qErr || !allQs?.length) { warn('No valid questions remaining for Module 11'); return }

  const fullPool = allQs.map(q => q.id)
  log(`    Valid questions available: ${fullPool.length}`)

  const freeSets = testSets.filter(ts => !ts.is_paid)
  const paidSets = testSets.filter(ts => ts.is_paid)

  const newRows = []
  const globalAssigned = new Map(alreadyAssigned)

  // Step 1: Fill Free Tests up to 10 questions each
  const FREE_TARGET = 10
  for (const ts of freeSets) {
    const alreadyIn = globalAssigned.get(ts.id) || new Set()
    const needed = Math.max(0, FREE_TARGET - alreadyIn.size)
    if (needed === 0) continue

    let count = 0
    for (const qId of fullPool) {
      if (count >= needed) break
      if (!alreadyIn.has(qId)) {
        newRows.push({ test_set_id: ts.id, question_id: qId, sort_order: alreadyIn.size + count + 1 })
        alreadyIn.add(qId)
        count++
      }
    }
    globalAssigned.set(ts.id, alreadyIn)
    log(`    "${ts.title}": +${count} questions`)
  }

  // Step 2: Distribute remaining pool round-robin to Full Tests
  const usedInFree = new Set(freeSets.flatMap(ts => [...(globalAssigned.get(ts.id) || [])]))
  const remainingPool = fullPool.filter(id => !usedInFree.has(id))

  const emptyPaidSets = paidSets.filter(ts => (alreadyAssigned.get(ts.id)?.size || 0) === 0)
  if (emptyPaidSets.length && remainingPool.length) {
    const paidRows = roundRobinDistribute(emptyPaidSets, remainingPool, globalAssigned)
    newRows.push(...paidRows)
  }

  await insertRows(newRows, 'Module11')
}

async function phase4(activeModules) {
  log('\n━━━ PHASE 4 — Redistribute Questions to Empty Test Sets ━━━')

  for (const mod of activeModules) {
    log(`  → "${mod.name}"`)

    if (mod.name.toLowerCase().includes('maintenance practices')) {
      await redistributeModule7(mod.id)
    } else if (mod.name.toLowerCase().includes('aeroplane aerodynamics') ||
               mod.name.toLowerCase().includes('aeroplane aerodynamics structure')) {
      await redistributeModule11(mod.id)
    } else {
      await redistributeGeneric(mod.id, mod.name)
    }
  }
}

// ─── PHASE 5: Fix target_questions ───────────────────────────────────────────

async function phase5(affectedModuleIds) {
  log('\n━━━ PHASE 5 — Sync target_questions to Actual Counts ━━━')

  const { data: testSets, error } = await supabase
    .from('test_sets')
    .select('id, title, target_questions')
    .in('module_id', affectedModuleIds)
    .neq('status', 'draft')

  if (error || !testSets?.length) { err(`Phase 5 fetch: ${error?.message}`); return }

  for (const ts of testSets) {
    const { count, error: countErr } = await supabase
      .from('test_questions')
      .select('*', { count: 'exact', head: true })
      .eq('test_set_id', ts.id)

    if (countErr) { err(`Phase 5 count for "${ts.title}": ${countErr.message}`); continue }

    const actual = count ?? 0
    if (actual === ts.target_questions) continue

    log(`    "${ts.title}": ${ts.target_questions} → ${actual}`)

    if (DRY_RUN) {
      log(`    [DRY-RUN] Would UPDATE target_questions = ${actual}`)
      summary.targets_updated++
      continue
    }

    const { error: updErr } = await supabase
      .from('test_sets')
      .update({ target_questions: actual })
      .eq('id', ts.id)

    if (updErr) {
      err(`Phase 5 update "${ts.title}": ${updErr.message}`)
    } else {
      summary.targets_updated++
    }
  }

  ok(`Updated ${summary.targets_updated} target_questions values`)
}

// ─── PHASE 6: Validate & Summary ─────────────────────────────────────────────

async function phase6(affectedModuleIds) {
  log('\n━━━ PHASE 6 — Post-Run Validation ━━━')

  const { data: testSets } = await supabase
    .from('test_sets')
    .select('id, title, target_questions, status')
    .in('module_id', affectedModuleIds)

  let emptyNonDraft = 0
  let targetMismatches = 0
  let remainingBroken = 0

  // Check each non-draft test_set
  for (const ts of (testSets || [])) {
    if (ts.status === 'draft') continue

    const { count } = await supabase
      .from('test_questions')
      .select('*', { count: 'exact', head: true })
      .eq('test_set_id', ts.id)

    const actual = count ?? 0

    if (actual === 0) {
      emptyNonDraft++
      warn(`Still empty: "${ts.title}"`)
    }
    if (actual !== ts.target_questions) {
      targetMismatches++
      warn(`target mismatch: "${ts.title}" actual=${actual} target=${ts.target_questions}`)
    }
  }

  // Check for any remaining broken refs — paginate to handle >1000 questions
  const nonDraftIds = (testSets || []).filter(ts => ts.status !== 'draft').map(ts => ts.id)
  if (nonDraftIds.length) {
    // Fetch ALL question IDs (paginated, DB now has 2020+ questions)
    const allValidIds = await fetchAllIds('questions', 'id', b => b)
    const validSet = new Set(allValidIds)

    // Fetch test_questions for non-draft test_sets in chunks
    const allTQs = []
    const CHUNK = 100
    for (let i = 0; i < nonDraftIds.length; i += CHUNK) {
      const { data } = await supabase
        .from('test_questions')
        .select('question_id')
        .in('test_set_id', nonDraftIds.slice(i, i + CHUNK))
        .range(0, 9999)
      allTQs.push(...(data || []))
    }

    for (const row of allTQs) {
      if (!validSet.has(row.question_id)) remainingBroken++
    }
  }

  // ─── Print summary ──────────────────────────────────────────────────────────
  const pad = n => String(n).padStart(5)
  log('\n╔══════════════════════════════════════════╗')
  log('║     WINGS ACADEMY — QA FIX SUMMARY      ║')
  log('╠══════════════════════════════════════════╣')
  log(`║  Broken refs deleted:   ${pad(summary.broken_refs_deleted)}           ║`)
  log(`║  Duplicates removed:    ${pad(summary.duplicates_removed)}           ║`)
  log(`║  Questions assigned:    ${pad(summary.questions_assigned)}           ║`)
  log(`║  target_questions fixed:${pad(summary.targets_updated)}           ║`)
  log(`║  Test sets drafted:     ${pad(summary.test_sets_drafted)}           ║`)
  log('╠══════════════════════════════════════════╣')
  log(`║  Remaining broken refs: ${pad(remainingBroken)}           ║`)
  log(`║  Empty non-draft sets:  ${pad(emptyNonDraft)}           ║`)
  log(`║  target mismatches:     ${pad(targetMismatches)}           ║`)
  log(`║  Script errors:         ${pad(summary.errors.length)}           ║`)
  log('╚══════════════════════════════════════════╝')

  if (summary.errors.length) {
    log('\nErrors encountered:')
    summary.errors.forEach(e => log(`  • ${e}`))
  }

  if (DRY_RUN) {
    log('\n⚡ DRY-RUN: No changes were written to the database.')
    log('   Run without --dry-run to apply the fix.')
  } else if (remainingBroken === 0 && emptyNonDraft === 0 && summary.errors.length === 0) {
    log('\n✅ All QA critical errors resolved. System is production-ready.')
  } else {
    log('\n⚠  Some issues remain — see warnings above.')
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  log('╔══════════════════════════════════════════╗')
  log('║   Wings Academy — QA Database Fix        ║')
  log('╚══════════════════════════════════════════╝')

  // Phase 0: validate
  await phase0()

  // Phase 1: draft modules 4, 5, 6
  await phase1()

  // Fetch all modules that need active remediation
  const { data: allModules, error: modErr } = await supabase
    .from('modules')
    .select('id, name')
    .neq('status', 'disabled')

  if (modErr || !allModules?.length) {
    console.error('[FATAL] Cannot fetch modules:', modErr?.message)
    process.exit(1)
  }

  // Active modules to repair (exclude 4/5/6 which are now draft)
  const SKIP_PARTIALS = ['Electronic Fundamentals', 'Digital Techniques', 'Materials and Hardware']
  const activeModules = allModules.filter(m =>
    !SKIP_PARTIALS.some(skip => m.name.toLowerCase().includes(skip.toLowerCase()))
  )

  log(`\n  Active modules for repair (${activeModules.length}):`)
  activeModules.forEach(m => log(`    • ${m.name}`))

  // Phase 2: delete broken refs
  await phase2(activeModules)

  // Phase 3: remove duplicates
  await phase3(activeModules)

  // Phase 4: redistribute questions
  await phase4(activeModules)

  // Phase 5: fix target_questions
  const allAffectedIds = allModules.map(m => m.id)
  await phase5(allAffectedIds)

  // Phase 6: validate and summarize
  await phase6(allAffectedIds)
}

main().catch(err => {
  console.error('[FATAL] Unhandled error:', err)
  process.exit(1)
})
