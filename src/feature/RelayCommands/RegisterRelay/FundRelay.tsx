import { ethers, BigNumber } from 'ethers'
import { useAppSelector } from '../../../hooks'

import { useBalance, useSendTransaction } from 'wagmi'

import { toast } from 'react-toastify'

import Button from 'react-bootstrap/Button'

import LoadingButton from '../../../components/LoadingButton'
import ErrorButton from '../../../components/ErrorButton'

export default function FundRelay () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress } = relay

  const funds = BigNumber.from(ethers.utils.parseEther(('0.5')))

  const { data: bal } = useBalance({ addressOrName: relayManagerAddress, watch: true })

  const FundButton = () => {
    const text = <span>Fund Relay with 0.5 ETH</span>
    const gasPrice = '22000000000'

    const { error: fundTxError, isIdle, isError, isLoading, isSuccess, sendTransaction: fundRelay } =
      useSendTransaction({
        request: {
          to: relayManagerAddress,
          value: funds,
          gasLimit: 50000,
          gasPrice: gasPrice
        },
        onSuccess (data) {
          toast.info(<span>Relay is being funded with <br /><b>{data.hash}</b>...</span>)
        }
      })

    if (isIdle) {
      return (
        <Button disabled={isLoading} onClick={() => fundRelay()}>
          {text}
        </Button>
      )
    }
    if (isLoading) return <LoadingButton />
    // TODO
    if (isSuccess) {
      return (
        <LoadingButton />
      )
    }
    if (isError) return (<ErrorButton message={fundTxError?.message} onClick={() => fundRelay()}><span>Retry {text}</span></ErrorButton>)

    return <span>Error while creating FundButton</span>
  }

  const Funder = () => {
    const isRelayFunded = (bal?.value.gte(funds))
    if (isRelayFunded === true) return (<span>Relay already funded ✓</span>)
    return <FundButton />
  }

  return <Funder />
}
