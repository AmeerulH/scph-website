import {defineField, defineType} from 'sanity'

/** Extra programme rows in the speaker modal. */
export const gtp2026HighlightSessionSlotType = defineType({
  name: 'gtp2026HighlightSessionSlot',
  title: 'Speaker session slot',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Session title', type: 'string'}),
    defineField({name: 'date', title: 'Date / time line', type: 'string'}),
  ],
})
