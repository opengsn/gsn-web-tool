import { ReactComponent as PlusCircleFill } from '../../assets/icons/plus-circle-fill.svg'
import { ReactComponent as Clipboard } from '../../assets/icons/clipboard.svg'
import { ReactComponent as ClipboardCheck } from '../../assets/icons/clipboard-check.svg'

const Icon = {
  PlusCircleFill: (props: { fill?: string }) => <PlusCircleFill {...props} />,
  Clipboard,
  ClipboardCheck
}

export default Icon
