import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'SCPH Sanity Studio',

  projectId: 'y0tkemxm',
  /** Override with `SANITY_DATASET` in `studio/.env` (see `studio/.env.example`). */
  dataset: process.env.SANITY_DATASET ?? 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
