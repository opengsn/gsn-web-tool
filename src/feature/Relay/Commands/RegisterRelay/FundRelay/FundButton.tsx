import { useEffect } from 'react'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

import { useDefaultStateSwitchers } from '../registerRelayHooks'

import { Box } from '../../../../../components/atoms'
import { TextFieldType } from '../../../../../components/atoms/TextField'
import RegistrationInputWithTitle from '../../../../../components/molecules/RegistrationInputWithTitle'
import { HashType } from '../../../../../types/Hash'
import { parseEther } from 'ethers/lib/utils.js'

interface IProps {
  hash?: HashType
  setHash: (hash: HashType) => void
  funds: string
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  relayManagerAddress: string
  handleChangeFunds: (value: string) => void
  error?: boolean
}

export default function FundButton({ setHash, funds, handleChangeFunds, hash, relayManagerAddress, setListen, error }: IProps) {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const setOwnerErrorMessage = error
    ? 'Relay Server failed to set it\'s owner on the StakeManager.\nCheck if the funding is sufficient'
    : undefined
  const { isLoading: isLoadingForTransaction } = useWaitForTransaction({
    hash,
    enabled: !!hash
  })

  const {
    config,
    error: prepareFundTxError,
    refetch
  } = usePrepareSendTransaction({
    request: {
      to: relayManagerAddress,
      value: parseEther(funds || '0')
    }
  })

  useEffect(() => {
    refetch().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    sendTransaction: fundRelay,
    isLoading,
    isSuccess,
    reset,
    error: fundError
  } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers,
    onSuccess: (data) => {
      setListen(true)
      setHash(data.hash)
    }
  })

  useEffect(() => {
    if (error) {
      reset()
    }
  }, [error, reset])

  const disabled = +funds <= 0

  return (
    <Box my='10px'>
      <RegistrationInputWithTitle
        title='Transfer ETH to the server in order to - this is an explanatory text about funding relay and how it works.'
        label='Funding amount (Recommended amount 0.5 ETH)'
        buttonText='Fund relay'
        isLoading={isLoading}
        isLoadingForTransaction={isLoadingForTransaction}
        isSuccess={isSuccess}
        error={prepareFundTxError?.message ?? fundError?.message ?? setOwnerErrorMessage}
        onClick={() => fundRelay?.()}
        value={funds}
        onChange={(value) => {
          handleChangeFunds(value)
        }}
        type={TextFieldType.Number}
        placeholder='Type amount'
        disabled={disabled}
      />
    </Box>
  )
}
