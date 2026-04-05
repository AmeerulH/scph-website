import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SCPH Sanity Studio',

  projectId: 'y0tkemxm',
  /** Override with `SANITY_DATASET` in `studio/.env` (see `studio/.env.example`). */
  dataset: process.env.SANITY_DATASET ?? 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
