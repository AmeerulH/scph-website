import {Badge, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {useEditState, useFormValue, pathToString, type ArrayOfObjectsInputProps} from 'sanity'
import {IntentLink} from 'sanity/router'

interface Workshop {
  _key: string
  number?: string
  title?: string
  poster?: {asset?: {_ref?: string}}
}

interface ProgrammeDay {
  _key: string
  tabId?: string
  label?: string
  sessions?: {
    _key: string
    type?: string
    time?: string
    workshops?: Workshop[]
  }[]
}

function ActionWorkshopIndex() {
  const {draft, published, ready} = useEditState('gtp2026Programme', 'gtp2026Programme')
  const programme = draft ?? published
  const days = (programme?.days ?? []) as ProgrammeDay[]
  const workshopDays = days.filter((day) => day.tabId === 'day2' || day.tabId === 'day3')
  const count = workshopDays.reduce((total, day) => total + (day.sessions ?? [])
    .filter((session) => session.type === 'concurrent')
    .reduce((sum, session) => sum + (session.workshops?.length ?? 0), 0), 0)

  if (!ready) return <Flex padding={3} gap={3}><Spinner /><Text>Loading workshops…</Text></Flex>

  if (!programme) {
    return <Card padding={3} tone="caution"><Text>Programme is unavailable. Check your access to GTP 2026 Programme.</Text></Card>
  }

  return (
    <Stack space={4}>
      <Card padding={3} tone="primary" radius={2}>
        <Stack space={3}>
          <Text weight="semibold">{count} Action Workshops</Text>
          <Text size={1}>Every workshop appears here, including those without a poster. Select a title to edit the existing workshop, then publish GTP 2026 Programme.</Text>
          {draft && <Badge tone="caution">Includes unpublished Programme changes</Badge>}
        </Stack>
      </Card>
      {workshopDays.map((day) => (
        <Stack key={day._key} space={3}>
          <Text weight="semibold">{day.label ?? day.tabId}</Text>
          {(day.sessions ?? []).filter((session) => session.type === 'concurrent').map((session) => (
            <Stack key={session._key} space={3}>
              {session.time && <Text size={1} muted>{session.time}</Text>}
              {(session.workshops ?? []).map((workshop) => (
                <Card key={workshop._key} padding={3} radius={2} border>
                  <Stack space={3}>
                    <IntentLink intent="edit" params={{
                      id: 'gtp2026Programme',
                      type: 'gtp2026Programme',
                      path: pathToString(['days', {_key: day._key}, 'sessions', {_key: session._key}, 'workshops', {_key: workshop._key}, 'title']),
                    }}>
                      <Text weight="semibold">{workshop.number ? `${workshop.number}. ` : ''}{workshop.title?.trim() || 'Untitled workshop'}</Text>
                    </IntentLink>
                    <Flex>
                      <Badge tone={workshop.poster?.asset?._ref ? 'positive' : 'caution'}>
                        {workshop.poster?.asset?._ref ? 'Poster uploaded' : 'Poster needed'}
                      </Badge>
                    </Flex>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ))}
        </Stack>
      ))}
      {count === 0 && <Text muted>No Action Workshops are currently listed in Programme.</Text>}
    </Stack>
  )
}

export function ActionWorkshopIndexInput(props: ArrayOfObjectsInputProps) {
  const slug = useFormValue(['slug'])
  return slug === 'action-workshops' ? <ActionWorkshopIndex /> : props.renderDefault(props)
}
