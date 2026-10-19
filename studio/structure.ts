import type {StructureResolver} from 'sanity/structure'

/**
 * Custom Studio desk structure.
 * GTP 2026 Speakers page nests speaker documents as a child list.
 * All other document types auto-generate via S.documentTypeListItems().
 */
export const structure: StructureResolver = (S) => {
  const CUSTOMISED_TYPES = new Set(['gtp2026SpeakersPage', 'gtp2026Speaker', 'gtp2026NewsArticle', 'gtp2026Resource', 'gtp2026ResourcesPage', 'gtp2026Video'])

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

      S.listItem()
        .title('GTP 2026 On the News')
        .schemaType('gtp2026NewsArticle')
        .child(S.list().title('On the News').items([
          S.listItem().title('Articles').child(
            S.documentTypeList('gtp2026NewsArticle').title('News articles')
              .defaultOrdering([{field: 'publishedAt', direction: 'desc'}, {field: '_createdAt', direction: 'desc'}]),
          ),
          S.listItem().title('Page settings & spotlight (Media → On the News)').child(
            S.document().schemaType('gtp2026MediaPage').documentId('gtp2026MediaPage'),
          ),
        ])),

      S.listItem().title('GTP 2026 Resources').schemaType('gtp2026Resource').child(
        S.list().title('Resources').items([
          S.listItem().title('Page settings').child(S.document().schemaType('gtp2026ResourcesPage').documentId('gtp2026ResourcesPage')),
          S.listItem().title('Resources & PDF downloads').child(S.documentTypeList('gtp2026Resource').title('Resources').defaultOrdering([{field: 'order', direction: 'asc'}])),
        ]),
      ),
      S.listItem().title('GTP 2026 Videos').schemaType('gtp2026Video').child(
        S.list().title('Videos').items([
          S.listItem().title('Page settings (Media → Videos)').child(S.document().schemaType('gtp2026MediaPage').documentId('gtp2026MediaPage')),
          ...[
            {title: 'Daily Highlights', value: 'dailyHighlights'},
            {title: 'Session Recordings', value: 'sessionRecordings'},
            {title: 'GTP2026 Playlist', value: 'playlist'},
          ].map(collection => S.listItem().title(collection.title).child(
            S.documentList().title(collection.title).schemaType('gtp2026Video')
              .filter('_type == "gtp2026Video" && collection == $collection').params({collection: collection.value})
              .initialValueTemplates([S.initialValueTemplateItem(`gtp-video-${collection.value}`)])
              .defaultOrdering([{field: 'day', direction: 'asc'}, {field: 'order', direction: 'asc'}]),
          )),
        ]),
      ),

      S.divider(),

      // ── Everything else auto-generated, minus the types we customised above ──
      ...S.documentTypeListItems().filter(
        (item) => !CUSTOMISED_TYPES.has(item.getId() ?? ''),
      ),
    ])
}
