import { useContext } from 'react'
import { useNetwork, useSendTransaction } from 'wagmi'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'

import { useDefaultStateSwitchers } from '../registerRelayHooks'
import { FunderContext } from './Funder'

import LoadingButton from '../../../../components/LoadingButton'
import ErrorButton from '../../../../components/ErrorButton'

export default function FundButton () {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { relayManagerAddress, funds, setListen } = useContext(FunderContext)
  const gasPrice = '22000000000'

  const { chain } = useNetwork()

  const { error: fundTxError, isIdle, isError, isLoading, isSuccess, sendTransaction: fundRelay } =
    useSendTransaction({
      request: {
        to: relayManagerAddress,
        value: funds,
        gasLimit: 50000,
        gasPrice: gasPrice
      },
      onSuccess (data) {
        let infoMsg
        if (chain?.blockExplorers !== undefined) {
          infoMsg = (
            <span>
              Relay is being funded:<br />
              <a href={chain.blockExplorers.default.url + '/' + data.hash}>Block Explorer</a>
            </span>
          )
        } else {
          infoMsg = (
            <span>
              Relay is being funded.<br /><b>{data.hash}</b>
            </span>
          )
        }
        setListen(true)
        toast.info(infoMsg)
      },
      ...defaultStateSwitchers
    })

  function createButton () {
    let FundButton
    const text = <span>Fund Relay with 0.5 ETH</span>

    if (isIdle) {
      FundButton = <>
        <Button disabled={isLoading} onClick={() => fundRelay()}>
          {text}
        </Button>
      </>
    }

    if (isLoading || isSuccess) {
      FundButton = <LoadingButton />
    }

    if (isError) {
      FundButton = <ErrorButton message={fundTxError?.message} onClick={() => fundRelay()}>
        <span>Retry {text}</span>
      </ErrorButton>
    }

    if (FundButton !== undefined) {
      return FundButton
    } else {
      return <span>Error while creating FundButton</span>
    }
  }

  return createButton()
}
