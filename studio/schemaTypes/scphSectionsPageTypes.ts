import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

type ScphSectionsDocOpts = {
  name: string
  title: string
  description?: string
}

function defineScphSectionsPage(opts: ScphSectionsDocOpts) {
  return defineType({
    name: opts.name,
    title: opts.title,
    type: 'document',
    fields: [
      defineField({
        name: 'internalTitle',
        title: 'Internal title',
        type: 'string',
        description: 'For Studio list only.',
        initialValue: opts.title,
      }),
      defineField({
        name: 'sections',
        title: 'Sections',
        type: 'array',
        of: [...sectionBlockMembers],
        description:
          opts.description ??
          'Optional blocks shown on the site below the page hero (stats, rich text, prose + CTAs).',
      }),
    ],
    preview: {
      select: {t: 'internalTitle'},
      prepare({t}) {
        return {title: t ?? opts.title}
      },
    },
  })
}

/** Main About Us marketing body (below hero). Add blocks here before hardcoded foundation/strategy/journey migrate fully. */
export const scphAboutPageType = defineScphSectionsPage({
  name: 'scphAboutPage',
  title: 'SCPH About page',
  description:
    'Optional CMS bands below the hero. Foundation, strategy, and journey sections still render from code until migrated.',
})

export const scphResearchPageType = defineScphSectionsPage({
  name: 'scphResearchPage',
  title: 'SCPH Research page',
  description: 'Optional blocks below the research hero (before the stats row).',
})

export const scphMediaPageType = defineScphSectionsPage({
  name: 'scphMediaPage',
  title: 'SCPH Media page',
  description: 'Optional blocks below the media hero (before article grid).',
})

export const scphNetworkPageType = defineScphSectionsPage({
  name: 'scphNetworkPage',
  title: 'SCPH Network page',
  description: 'Optional blocks below the network hero (before community + signup).',
})

export const scphEventsPageType = defineType({
  name: 'scphEventsPage',
  title: 'SCPH Events page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Events',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page title',
      type: 'string',
      description: 'Shown in the section header. Leave empty to use default "Events".',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page subtitle',
      type: 'string',
      description: 'Leave empty to use default "What\'s On".',
    }),
    defineField({
      name: 'sections',
      title: 'Intro sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description: 'Optional blocks between the top spacer and the event cards.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Events page'}
    },
  },
})

export const scphSectionPageTypes = [
  scphAboutPageType,
  scphResearchPageType,
  scphMediaPageType,
  scphNetworkPageType,
  scphEventsPageType,
]
