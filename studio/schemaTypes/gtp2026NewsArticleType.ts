import {defineField, defineType} from 'sanity'

export const gtp2026NewsArticleType = defineType({
  name: 'gtp2026NewsArticle',
  title: 'GTP 2026 News article',
  type: 'document',
  description: 'Published articles appear on Media → On the News. These link directly to the original publication.',
  fields: [
    defineField({name: 'title', title: 'Article title', type: 'string', validation: rule => rule.required().custom(value => value?.trim() ? true : 'Enter the article title.')}),
    defineField({name: 'publisher', title: 'Publication / publisher', type: 'string', validation: rule => rule.required().custom(value => value?.trim() ? true : 'Enter the publication name.')}),
    defineField({
      name: 'url', title: 'Original article URL', type: 'url',
      description: 'Paste the full HTTPS link. The article opens in a new tab.',
      validation: rule => rule.required().uri({scheme: ['https']}).custom(value => {
        if (!value) return true
        try {
          const url = new URL(value)
          return url.protocol === 'https:' && url.hostname && !url.username && !url.password && !/[\s\\\u0000-\u001f\u007f]/.test(value) ? true : 'Use a full HTTPS URL without spaces or credentials.'
        } catch { return 'Use a valid HTTPS URL.' }
      }),
    }),
    defineField({
      name: 'image', title: 'Article image', type: 'image',
      description: 'Upload a landscape article photo. Images fill each frame without stretching; their edges may be cropped. Keep important subjects near the centre.',
      validation: rule => rule.required().assetRequired(),
      fields: [defineField({name: 'alt', title: 'Image description', type: 'string', description: 'Describe the image for someone who cannot see it.', validation: rule => rule.required().custom(value => value?.trim() ? true : 'Describe the image.')})],
    }),
    defineField({name: 'imageCredit', title: 'Image credit', type: 'string', description: 'Optional credit supplied by the publication.'}),
    defineField({name: 'category', title: 'Category', type: 'string', initialValue: 'gtpConference', options: {list: [{title: 'GTP conference', value: 'gtpConference'}, {title: 'Other articles', value: 'other'}], layout: 'radio'}, validation: rule => rule.required().custom(value => value === 'gtpConference' || value === 'other' ? true : 'Choose a category.')}),
    defineField({name: 'publishedAt', title: 'Article publication date', type: 'date', description: 'The publication’s real date. Leave blank if unknown; no date will be shown.'}),
  ],
  orderings: [{title: 'Publication date, newest first', name: 'publicationDate', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'publisher', media: 'image'}},
})
