import { useState } from 'react'

import HubAuthorizedListener from './HubAuthorizedListener'
import Modal from '../../../../../components/atoms/Modal'
import { Typography } from '../../../../../components/atoms'
import AuthorizeHub from './AuthorizeHub'

export default function Authorizer() {
  const [listen, setListen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(true)
  const [isAuthorizeHub, setIsAuthorizeHub] = useState<boolean>(true)

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Typography variant={'h5'}>Waiting for server</Typography>
      <AuthorizeHub setListen={setListen} listen={listen} setIsAuthorizeHub={setIsAuthorizeHub} isAuthorizeHub={isAuthorizeHub} />
      <HubAuthorizedListener listen={listen} setListen={setListen} />
    </Modal>
  )
}
