import { useContext, useEffect } from 'react'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { useDefaultStateSwitchers } from '../registerRelayHooks'
import { FunderContext } from './Funder'

import { Box } from '../../../../../components/atoms'
import { TextFieldType } from '../../../../../components/atoms/TextField'
import { BigNumber, ethers } from 'ethers'
import Alert from '../../../../../components/atoms/Alert'
import RegistrationInputWithTitle from '../../../../../components/molecules/RegistrationInputWithTitle'

interface IProps {
  setHash: (hash: string) => void
}

export default function FundButton({ setHash }: IProps) {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { relayManagerAddress, funds, handleChangeFunds, setListen } = useContext(FunderContext)

  const {
    config,
    error: prepareFundTxError,
    refetch
  } = usePrepareSendTransaction({
    request: {
      to: relayManagerAddress,
      value: BigNumber.from(ethers.utils.parseEther(funds.toString()))
    }
  })

  useEffect(() => {
    refetch().catch(console.error)
  }, [])

  const {
    sendTransaction: fundRelay,
    isLoading,
    isSuccess,
    isError,
    error
  } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers,
    onSuccess: (data) => {
      setListen(true)
      setHash(data.hash)
    }
  })

  if (isError) return <Alert severity='error'>Error : {error?.message}</Alert>

  return (
    <Box my='10px'>
      <RegistrationInputWithTitle
        title='Transfer ETH to the server in order to - this is an explanatory text about funding relay and how it works.'
        label='Funding amount (Recommended amount 0.5 ETH)'
        buttonText='Fund relay'
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={prepareFundTxError?.message}
        onClick={() => fundRelay?.()}
        value={funds.toString()}
        onChange={(value) => {
          handleChangeFunds(+value)
        }}
        type={TextFieldType.Number}
        placeholder='Type amount'
      />
    </Box>
  )
}
