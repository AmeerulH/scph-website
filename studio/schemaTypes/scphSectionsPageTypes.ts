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

/** Main About body (below hero): CMS fills foundation / strategy / journey; optional `sections` for extra bands. */
export const scphAboutPageType = defineType({
  name: 'scphAboutPage',
  title: 'SCPH About page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'For Studio list only.',
      initialValue: 'About page',
    }),
    defineField({
      name: 'foundation',
      title: 'Our Foundation',
      type: 'scphAboutFoundationBand',
      description: 'Two-column band with copy and two diagrams.',
    }),
    defineField({
      name: 'strategy',
      title: 'Vision & strategy',
      type: 'scphAboutStrategyBand',
      description: 'Intro copy and four strategy cards.',
    }),
    defineField({
      name: 'journey',
      title: 'Our Journey',
      type: 'scphAboutJourneyBand',
      description: 'Timeline placeholder until assets arrive.',
    }),
    defineField({
      name: 'sections',
      title: 'Additional sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'Optional extra bands after Meet the Team (stats, rich text, prose + CTAs).',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH About page'}
    },
  },
})

export const scphResearchPageType = defineType({
  name: 'scphResearchPage',
  title: 'SCPH Research page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Research page',
    }),
    defineField({
      name: 'statsRow',
      title: 'Stats row',
      type: 'sectionStatsRow',
      description: 'Four headline numbers under the hero.',
    }),
    defineField({
      name: 'roadmapBlock',
      title: 'Roadmap (prose + CTAs)',
      type: 'sectionProseCta',
      description: '"How Do We Do Planetary Health?" band with download links.',
    }),
    defineField({
      name: 'pillarsSectionSubtitle',
      title: 'Pillars section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'pillarsSectionTitle',
      title: 'Pillars section title',
      type: 'string',
    }),
    defineField({
      name: 'pillars',
      title: 'Seven pillars',
      type: 'array',
      of: [{type: 'scphResearchPillarCard'}],
    }),
    defineField({
      name: 'sections',
      title: 'Additional sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description: 'Optional bands after the pillar grid.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Research page'}
    },
  },
})

export const scphMediaPageType = defineType({
  name: 'scphMediaPage',
  title: 'SCPH Media page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Media page',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      description: 'Plain text (e.g. News & Articles).',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'articlesSectionTitle',
      title: 'Articles block title',
      type: 'string',
    }),
    defineField({
      name: 'articlesSectionSubtitle',
      title: 'Articles block subtitle',
      type: 'string',
    }),
    defineField({
      name: 'viewAllArticlesUrl',
      title: '“View all articles” URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'viewAllArticlesLabel',
      title: '“View all” link label',
      type: 'string',
    }),
    defineField({
      name: 'readArticleLabel',
      title: 'Per-card link label',
      type: 'string',
      description: 'Default: Read Article',
    }),
    defineField({
      name: 'articlesIntroNote',
      title: 'Note before footer link',
      type: 'text',
      rows: 2,
      description: 'Shown under the cards, before the “View all” link.',
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{type: 'scphMediaArticleItem'}],
      description: 'Cards in the grid; order matches display order.',
    }),
    defineField({
      name: 'sections',
      title: 'Additional sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description: 'Optional bands between the hero and the article grid.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Media page'}
    },
  },
})

export const scphNetworkPageType = defineType({
  name: 'scphNetworkPage',
  title: 'SCPH Network page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Network page',
    }),
    defineField({
      name: 'community',
      title: 'Community (who qualifies + benefits)',
      type: 'scphNetworkCommunityBand',
      description: 'Two-column band above the signup form.',
    }),
    defineField({
      name: 'sections',
      title: 'Additional sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description: 'Optional bands between community and signup.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Network page'}
    },
  },
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

/** Stage 4: replaces placeholder when `sections` has blocks; otherwise shows coming-soon copy. */
export const scphProgrammesPageType = defineType({
  name: 'scphProgrammesPage',
  title: 'SCPH Programmes page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Programmes',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Title (placeholder mode)',
      type: 'string',
      description: 'Shown as the main heading when the page is still in “coming soon” mode.',
      initialValue: 'Programmes',
    }),
    defineField({
      name: 'placeholderDescription',
      title: 'Coming soon description',
      type: 'text',
      rows: 4,
      description: 'Body text under the title when no section blocks are published.',
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'When this list has visible blocks, the site shows them instead of the placeholder.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Programmes page'}
    },
  },
})

export const scphProjectsPageType = defineType({
  name: 'scphProjectsPage',
  title: 'SCPH Projects page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Projects',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Title (placeholder mode)',
      type: 'string',
      initialValue: 'Projects',
    }),
    defineField({
      name: 'placeholderDescription',
      title: 'Coming soon description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'When this list has visible blocks, the site shows them instead of the placeholder.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'SCPH Projects page'}
    },
  },
})

export const scphSectionPageTypes = [
  scphAboutPageType,
  scphResearchPageType,
  scphMediaPageType,
  scphNetworkPageType,
  scphEventsPageType,
  scphProgrammesPageType,
  scphProjectsPageType,
]
