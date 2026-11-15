import {defineField, type FieldDefinition} from 'sanity'

type HiddenFn = (context: {parent?: {type?: string}}) => boolean

/** Per session or workshop. Empty name and logo keep the programme-level Hosted by default. */
export function programmeHostedByFields(hidden?: HiddenFn): FieldDefinition[] {
  return [
    defineField({
      name: 'hostedByHosts',
      title: 'Hosted by — organisations',
      type: 'array',
      fieldset: 'hostedBy',
      hidden,
      description:
        'The complete ordered host list for this popup. A populated list replaces the inherited host and the single-organisation fields below. Leave empty to keep existing host behavior. Room/venue is edited separately.',
      of: [{
        type: 'object',
        name: 'programmeHost',
        title: 'Host organisation',
        fields: [
          defineField({name: 'name', title: 'Organisation name', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'subtitle', title: 'Subtitle', type: 'string', description: 'Optional organisation detail, displayed under its name. This does not set the session room.'}),
          defineField({
            name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true},
            fields: [defineField({
              name: 'alt', title: 'Alt text', type: 'string',
              validation: (rule) => rule.custom((alt, context) => {
                const parent = context.parent as {asset?: {_ref?: string}} | undefined
                return !parent?.asset?._ref || (typeof alt === 'string' && alt.trim())
                  ? true : 'Alt text is required when a logo is uploaded'
              }),
            })],
          }),
        ],
        preview: {select: {title: 'name', subtitle: 'subtitle', media: 'logo'}},
      }],
    }),
    defineField({
      name: 'hostedByLogo',
      title: 'Hosted by — organisation logo',
      type: 'image',
      fieldset: 'hostedBy',
      hidden,
      options: {hotspot: true},
      description:
        'Shown in this popup only. Leave empty, with the organisation name, to use the programme default at the top of GTP 2026 Programme.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the logo for screen readers.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !(typeof alt === 'string' && alt.trim())) {
                return 'Alt text is required when an image is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'hostedByName',
      title: 'Hosted by — organisation',
      type: 'string',
      fieldset: 'hostedBy',
      hidden,
      description:
        'Organisation for this popup. Leave empty to use the programme default.',
    }),
    defineField({
      name: 'hostedByLocation',
      title: 'Hosted by — location',
      type: 'string',
      fieldset: 'hostedBy',
      hidden,
      description:
        'Room or venue for this popup. Shown on the map pin. If the organisation and logo stay empty, this still replaces the location under the programme host. If this row sets its own organisation or logo, this is the location under that name.',
    }),
    defineField({
      name: 'hostedByShowLocation',
      title: 'Hosted by — show location',
      type: 'boolean',
      fieldset: 'hostedBy',
      hidden,
      initialValue: true,
      description: 'Turn off to hide the location line for this popup.',
    }),
  ]
}
