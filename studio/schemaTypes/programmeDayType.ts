import {defineField, defineType} from 'sanity'

export const programmeDayType = defineType({
  name: 'programmeDay',
  title: 'Programme day / tab',
  type: 'object',
  fields: [
    defineField({
      name: 'tabId',
      title: 'Tab',
      type: 'string',
      description: 'Must match the programme page tabs (URL ?tab=…).',
      options: {
        list: [
          {title: 'Pre-Conference', value: 'pre'},
          {title: 'Day 1', value: 'day1'},
          {title: 'Day 2', value: 'day2'},
          {title: 'Day 3', value: 'day3'},
          {title: 'Day 4', value: 'day4'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Tab label',
      type: 'string',
      description: 'Shown in the day strip, e.g. Day 1 · 12 Oct',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'carouselDateLabel',
      title: 'Carousel date label',
      type: 'string',
      description: 'Short date for home/about carousel chips, e.g. 12 Oct',
    }),
    defineField({
      name: 'carouselDayLabel',
      title: 'Carousel day label',
      type: 'string',
      description: 'Short day label for carousel, e.g. Day 1',
    }),
    defineField({
      name: 'sessions',
      title: 'Sessions',
      type: 'array',
      of: [{type: 'programmeSession'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {label: 'label', tabId: 'tabId', count: 'sessions'},
    prepare({label, tabId, count}) {
      const n = Array.isArray(count) ? count.length : 0
      return {
        title: label ?? tabId,
        subtitle: `${n} session${n === 1 ? '' : 's'}`,
      }
    },
  },
})
