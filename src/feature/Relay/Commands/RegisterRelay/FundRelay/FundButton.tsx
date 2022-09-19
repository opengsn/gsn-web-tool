import { useContext } from 'react'
import { toast } from 'react-toastify'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import Button from 'react-bootstrap/Button'

import { useDefaultStateSwitchers } from '../registerRelayHooks'
import { FunderContext } from './Funder'

import ErrorButton from '../../../components/ErrorButton'
import LoadingButton from '../../../components/LoadingButton'
import TransactionSuccessToast from '../../../components/TransactionSuccessToast'

export default function FundButton () {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { relayManagerAddress, funds, setListen } = useContext(FunderContext)

  const { config, error: prepareFundTxError, isError: prepareIsError } = usePrepareSendTransaction({
    request: {
      to: relayManagerAddress,
      value: funds
    }
  })

  const { sendTransaction: fundRelay, error: fundTxError, isIdle, isError, isLoading, isSuccess } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers,
    onSuccess (data) {
      const text = 'Funded relay.'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
      setListen(true)
    }
  })

  function createButton () {
    let FundButton
    const text = <span>Fund Relay with 0.5 ETH</span>

    switch (true) {
      case isIdle:
        FundButton = <>
          <Button disabled={isLoading} onClick={() => fundRelay?.()}>
            {text}
          </Button>
          {prepareIsError ? <span>Error: {prepareFundTxError?.message}</span> : null}
        </>
        break
      case isLoading || isSuccess:
        FundButton = <LoadingButton />
        break
      case isError:
        FundButton = <ErrorButton message={fundTxError?.message} onClick={() => fundRelay?.()}>
          <span>Retry {text}</span>
        </ErrorButton>
        break
    }

    if (FundButton !== undefined) {
      return FundButton
    } else {
      return <span>Error while creating FundButton</span>
    }
  }

  return createButton()
}