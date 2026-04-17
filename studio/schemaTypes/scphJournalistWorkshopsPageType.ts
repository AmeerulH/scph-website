import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton: gated journalist workshop resources (access codes + Drive folder ids).
 * Next.js unlock + Drive UI consume this in later phases.
 */
export const scphJournalistWorkshopsPageType = defineType({
  name: 'scphJournalistWorkshopsPage',
  title: 'SCPH Journalist workshops',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Journalist workshops',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page title (hero)',
      type: 'string',
      description: 'Main heading when the gated page is built.',
      initialValue: 'Journalist workshops',
    }),
    defineField({
      name: 'intro',
      title: 'Intro (optional)',
      type: 'text',
      rows: 4,
      description: 'Short text above the unlock form when the page is wired.',
    }),
    defineField({
      name: 'workshops',
      title: 'Workshops',
      type: 'array',
      description:
        'Each row: access code journalists receive, and the Drive folder id for that cohort (subfolder URL, not the whole library unless intended).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'scphJournalistWorkshopRow',
          fields: [
            defineField({
              name: 'title',
              title: 'Workshop title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {source: 'title', maxLength: 96},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'accessCode',
              title: 'Access code',
              type: 'string',
              description:
                'Code journalists enter to unlock this folder. Treat as sensitive.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'driveFolderId',
              title: 'Google Drive folder id',
              type: 'string',
              description:
                'From the folder URL: drive.google.com/drive/folders/FOLDER_ID. Share that folder with the site service account (Viewer).',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              initialValue: true,
              description:
                'Turn off to hide this workshop from unlock without deleting the row.',
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort order',
              type: 'number',
              description: 'Lower numbers appear first in editor lists (optional).',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {title: 'title', code: 'accessCode', on: 'enabled'},
            prepare({title, code, on}) {
              return {
                title: title ?? 'Workshop',
                subtitle: [on === false ? 'Disabled' : null, code ? `Code: ${code}` : null]
                  .filter(Boolean)
                  .join(' · '),
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {t: 'internalTitle', n: 'workshops'},
    prepare({t, n}) {
      const count = Array.isArray(n) ? n.length : 0
      return {
        title: t ?? 'Journalist workshops',
        subtitle: `${count} workshop(s)`,
      }
    },
  },
})
