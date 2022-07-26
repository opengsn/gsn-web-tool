import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

import AuthorizeHubButton from './AuthorizeHubButton'
import ErrorButton from '../../../../components/ErrorButton'
import LoadingButton from '../../../../components/LoadingButton'
import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'

import { useContract } from 'wagmi'

import relayHubAbi from '../../../../contracts/relayHub.json'
import StakeManagerAbi from '../../../../contracts/stakeManager.json'
import HubAuthorizedListener from './HubAuthorizedListener'

export default function Authorizer () {
  const [listen, setListen] = useState<boolean>(false)
  const relay = useAppSelector((state) => state.relay.relay)
  const [relayManagerAuthorized, setRelayManagerAuthorized] = useState(false)

  const {
    relayManagerAddress,
    relayHubAddress
  } = relay

  const {
    data: stakeManagerAddressData
  } = useStakeManagerAddress(relayHubAddress)

  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const { data: relayHub } = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi
  })

  useEffect(() => {
    const isHubAuthorized = async () => {
      try {
        await relayHub.verifyRelayManagerStaked(relayManagerAddress)
        setRelayManagerAuthorized(true)
      } catch (e: any) {
        // hide expected error
      }
    }

    if (relayHub !== undefined) {
      isHubAuthorized().catch((e) => toast.error(e.message))
    }
  }, [relayHub, relayManagerAddress])

  return (<>
    <AuthorizeHubButton setListen={setListen} />
    <HubAuthorizedListener listen={listen} setListen={setListen} />
  </>)
}
