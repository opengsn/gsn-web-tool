import { useState } from 'react'

import AuthorizeHubButton from './AuthorizeHubButton'
import HubAuthorizedListener from './HubAuthorizedListener'

export default function Authorizer () {
  const [listen, setListen] = useState<boolean>(false)

  return (<>
    <AuthorizeHubButton setListen={setListen} />
    <HubAuthorizedListener listen={listen} setListen={setListen} />
  </>)
}
