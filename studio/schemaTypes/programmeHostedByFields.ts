import {defineField, type FieldDefinition} from 'sanity'

type HiddenFn = (context: {parent?: {type?: string}}) => boolean

/** Per session or workshop. Empty name and logo keep the programme-level Hosted by default. */
export function programmeHostedByFields(hidden?: HiddenFn): FieldDefinition[] {
  return [
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
        'Location under the organisation name. Used only when this session or workshop sets its own organisation or logo.',
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
