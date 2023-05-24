import { ReactComponent as PlusCircleFill } from '../../assets/icons/plus-circle-fill.svg'
import { ReactComponent as Clipboard } from '../../assets/icons/clipboard.svg'
import { ReactComponent as ClipboardCheck } from '../../assets/icons/clipboard-check.svg'
import { ReactComponent as Chevron } from '../../assets/icons/chevron.svg'
import { ReactComponent as Success } from '../../assets/icons/success.svg'
import { ReactComponent as Edit } from '../../assets/icons/edit.svg'
import { ReactComponent as Info } from '../../assets/icons/info.svg'
import { ReactComponent as Token } from '../../assets/icons/token.svg'
import { ReactComponent as CopyToClipboard } from '../../assets/icons/copy-to-clipboard.svg'
import { ReactComponent as Redirect } from '../../assets/icons/redirect.svg'

const Icon = {
  PlusCircleFill: (props: { fill?: string }) => <PlusCircleFill {...props} />,
  Clipboard,
  ClipboardCheck,
  Chevron,
  Success,
  Edit,
  Info: (props: { fill?: string, width?: string, height?: string }) => <Info {...props} />,
  Token,
  CopyToClipboard,
  Redirect: (props: { width?: string, height?: string }) => <Redirect {...props} />
}

export default Icon
