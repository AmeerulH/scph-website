import {PatchEvent, set, type ArrayOfPrimitivesInputProps} from 'sanity'

/** Keep an explicitly cleared selection distinct from older rows without Roles. */
export function ProgrammeRoleOptionsInput(props: ArrayOfPrimitivesInputProps) {
  const onChange: ArrayOfPrimitivesInputProps['onChange'] = (event) => {
    const patches = PatchEvent.from(event).patches.map((patch) =>
      patch.type === 'unset' && patch.path.length === 0 ? set([]) : patch,
    )
    props.onChange(PatchEvent.from(patches))
  }

  return props.renderDefault({...props, onChange})
}
