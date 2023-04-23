import { useState } from 'react'

import HubAuthorizedListener from './HubAuthorizedListener'
import Modal from '../../../../../components/atoms/Modal'
import { Typography } from '../../../../../components/atoms'
import AuthorizeHub from './AuthorizeHub'

export default function Authorizer() {
  const [listen, setListen] = useState<boolean>(false)

  return (
    <Modal open={true}>
      <Typography>Waiting for server</Typography>
      <AuthorizeHub setListen={setListen} listen={listen} />
      <HubAuthorizedListener listen={listen} setListen={setListen} />
    </Modal>
  )
}
