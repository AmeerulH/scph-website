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
    templates: previous => [
      ...previous.filter(template => template.schemaType !== 'gtp2026ResourcesPage'),
      ...['dailyHighlights', 'sessionRecordings', 'playlist'].map(collection => ({
        id: `gtp-video-${collection}`, title: `GTP video: ${collection}`, schemaType: 'gtp2026Video', value: {collection},
      })),
    ],
  },
})
