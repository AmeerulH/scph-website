/**
 * GTP 2026 programme (data.tsx) → Sanity `gtp2026Programme` document
 *
 * Reads agenda from src/components/gtp/programmes/data.tsx and createOrReplace
 * document id `gtp2026Programme`. Re-running overwrites the same document.
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN in .env.local (Editor+), same as import-team-to-sanity.js
 *
 * Dataset: uses SANITY_DATASET from .env.local (same as the Next.js app), default production.
 *
 * A visible **test session** is appended to Day 1 when SANITY_DATASET=development or when
 * GTP_APPEND_TEST_SESSION=1 (so you can confirm the site reads from that dataset).
 *
 * Usage:
 *   npx tsx scripts/import-gtp-programme-to-sanity.ts
 *   DRY_RUN=1 npx tsx scripts/import-gtp-programme-to-sanity.ts   # print JSON only
 */

import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

import {day1, day2, day3, day4, TABS} from '../src/components/gtp/programmes/data'
import type {Session, Speaker, Workshop} from '../src/components/gtp/programmes/types'

dotenv.config({path: path.join(process.cwd(), '.env.local')})

const CAROUSEL: Record<
  string,
  {carouselDateLabel?: string; carouselDayLabel?: string}
> = {
  pre: {carouselDayLabel: 'Pre-Conference'},
  day1: {carouselDateLabel: '12 Oct', carouselDayLabel: 'Day 1'},
  day2: {carouselDateLabel: '13 Oct', carouselDayLabel: 'Day 2'},
  day3: {carouselDateLabel: '14 Oct', carouselDayLabel: 'Day 3'},
  day4: {carouselDateLabel: '15 Oct', carouselDayLabel: 'Day 4'},
}

const DAY_SESSIONS: Record<string, Session[]> = {
  day1,
  day2,
  day3,
  day4,
}

/** Shown at end of Day 1 when seeding development (or GTP_APPEND_TEST_SESSION=1). */
const SANITY_CONNECTION_TEST_SESSION: Session = {
  time: '23:59',
  durationMins: 1,
  type: 'lightning',
  title: 'Sanity connection test — remove in Studio when done',
  theme: 'shift',
  speakerCount: 1,
}

function shouldAppendTestSession(): boolean {
  return (
    process.env.GTP_APPEND_TEST_SESSION === '1' ||
    process.env.SANITY_DATASET === 'development'
  )
}

function mapSpeaker(s: Speaker) {
  return {
    _type: 'programmeSpeaker' as const,
    name: s.name,
    ...(s.designation ? {designation: s.designation} : {}),
  }
}

function mapWorkshop(w: Workshop) {
  return {
    _type: 'programmeWorkshop' as const,
    number: w.number,
    title: w.title,
  }
}

function mapSession(s: Session) {
  const row: Record<string, unknown> = {
    _type: 'programmeSession',
    time: s.time,
    title: s.title,
    type: s.type,
  }
  if (s.durationMins != null) row.durationMins = s.durationMins
  if (s.theme) row.theme = s.theme
  if (s.speakerCount != null) row.speakerCount = s.speakerCount
  if (s.speakers?.length) row.speakers = s.speakers.map(mapSpeaker)
  if (s.workshops?.length) row.workshops = s.workshops.map(mapWorkshop)
  if (s.breakLabel) row.breakLabel = s.breakLabel
  if (s.breakIcon) row.breakIcon = s.breakIcon
  if (s.isEvening === true) row.isEvening = true
  return row
}

function buildDays(appendTestSession: boolean) {
  return TABS.map((tab) => {
    const carousel = CAROUSEL[tab.id] ?? {}
    let sessionsRaw = tab.id === 'pre' ? [] : DAY_SESSIONS[tab.id] ?? []
    if (appendTestSession && tab.id === 'day1') {
      sessionsRaw = [...sessionsRaw, SANITY_CONNECTION_TEST_SESSION]
    }
    return {
      _type: 'programmeDay' as const,
      tabId: tab.id,
      label: tab.label,
      ...(carousel.carouselDateLabel
        ? {carouselDateLabel: carousel.carouselDateLabel}
        : {}),
      ...(carousel.carouselDayLabel
        ? {carouselDayLabel: carousel.carouselDayLabel}
        : {}),
      sessions: sessionsRaw.map(mapSession),
    }
  })
}

function buildDocument() {
  const appendTest = shouldAppendTestSession()
  return {
    _id: 'gtp2026Programme',
    _type: 'gtp2026Programme' as const,
    internalTitle: 'GTP 2026 programme',
    days: buildDays(appendTest),
  }
}

async function main() {
  const doc = buildDocument()

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(doc, null, 2))
    return
  }

  const token = process.env.SANITY_API_TOKEN
  if (!token) {
    console.error(
      'SANITY_API_TOKEN is not set. Add it to .env.local (see import-team-to-sanity.js).',
    )
    process.exit(1)
  }

  const dataset = process.env.SANITY_DATASET ?? 'production'

  const client = createClient({
    projectId: 'y0tkemxm',
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  await client.transaction().createOrReplace(doc).commit({autoGenerateArrayKeys: true})
  console.log(
    `Upserted gtp2026Programme on dataset "${dataset}".` +
      (shouldAppendTestSession()
        ? ' Day 1 includes a test lightning session at 23:59.'
        : '') +
      ' Open Studio (same dataset) and Publish if the document is still a draft.',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
