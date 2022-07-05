import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

import ErrorButton from '../../../components/ErrorButton'
import LoadingButton from '../../../components/LoadingButton'
import { useAppSelector, useStakeManagerAddress, useStakeInfo } from '../../../hooks'

import { useContract, useContractWrite } from 'wagmi'

import relayHubAbi from '../../../contracts/relayHub.json'
import StakeManagerAbi from '../../../contracts/stakeManager.json'

export default function AuthorizehHub () {
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

  const { data: newStakeInfoData } = useStakeInfo(stakeManagerAddress, relayManagerAddress)

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

  const AuthorizeButton = () => {
    const { error: authorizeTxError, isError, isLoading, isSuccess, write: authorizeHub } = useContractWrite(
      {
        addressOrName: stakeManagerAddress,
        contractInterface: StakeManagerAbi
      },
      'authorizeHubByOwner',
      {
        args: [relayManagerAddress, relayHubAddress],
        onSuccess (data) {
          toast.info(<span>Authorized relay tx:<br />{data.hash}</span>)
        }
      }
    )

    const text = <span>Authorize Hub</span>

    if (isError) return <ErrorButton message={authorizeTxError?.message}>{text}</ErrorButton>
    if (isLoading) return <LoadingButton />

    if (isSuccess) return <span>Authorized. Wait before relay is ready</span>
    if (relayManagerAuthorized) return <div>Relay already authorized</div>

    return (
      <Button onClick={() => authorizeHub()}>Authorize Hub</Button>
    )
  }

  return <AuthorizeButton />
}
