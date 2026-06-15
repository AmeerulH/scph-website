import type {StructureResolver} from 'sanity/structure'

/**
 * Custom Studio desk structure.
 * GTP 2026 Speakers page nests speaker documents as a child list.
 * All other document types auto-generate via S.documentTypeListItems().
 */
export const structure: StructureResolver = (S) => {
  const CUSTOMISED_TYPES = new Set(['gtp2026SpeakersPage', 'gtp2026Speaker'])

  return S.list()
    .title('Content')
    .items([
      // ── GTP 2026 Speakers page: page settings + speaker list nested together ──
      S.listItem()
        .title('GTP 2026 Speakers page')
        .schemaType('gtp2026SpeakersPage')
        .child(
          S.list()
            .title('GTP 2026 Speakers page')
            .items([
              S.listItem()
                .title('Page settings (hero)')
                .child(
                  S.document()
                    .schemaType('gtp2026SpeakersPage')
                    .documentId('gtp2026SpeakersPage'),
                ),
              S.listItem()
                .title('Speakers')
                .child(
                  S.documentList()
                    .title('Speakers')
                    .filter('_type == "gtp2026Speaker"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      S.divider(),

      // ── Everything else auto-generated, minus the types we customised above ──
      ...S.documentTypeListItems().filter(
        (item) => !CUSTOMISED_TYPES.has(item.getId() ?? ''),
      ),
    ])
}
