import { ReactComponent as PlusCircleFill } from '../../assets/icons/plus-circle-fill.svg'
import { ReactComponent as Clipboard } from '../../assets/icons/clipboard.svg'
import { ReactComponent as ClipboardCheck } from '../../assets/icons/clipboard-check.svg'
import { ReactComponent as Chevron } from '../../assets/icons/chevron.svg'
import { ReactComponent as Success } from '../../assets/icons/success.svg'
import { ReactComponent as Edit } from '../../assets/icons/edit.svg'

const Icon = {
  PlusCircleFill: (props: { fill?: string }) => <PlusCircleFill {...props} />,
  Clipboard,
  ClipboardCheck,
  Chevron,
  Success,
  Edit
}

export default Icon
