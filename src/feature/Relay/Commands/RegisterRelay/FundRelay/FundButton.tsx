import { useEffect } from 'react'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'

import { useDefaultStateSwitchers } from '../registerRelayHooks'

import { Box } from '../../../../../components/atoms'
import { TextFieldType } from '../../../../../components/atoms/TextField'
import { BigNumber, ethers } from 'ethers'
import RegistrationInputWithTitle from '../../../../../components/molecules/RegistrationInputWithTitle'
import { HashType } from '../../../../../types/Hash'

interface IProps {
  hash?: HashType
  setHash: (hash: HashType) => void
  funds: number
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  relayManagerAddress: string
  handleChangeFunds: (value: number) => void
}

export default function FundButton({ setHash, funds, handleChangeFunds, hash, relayManagerAddress, setListen }: IProps) {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { isLoading: isLoadingForTransaction } = useWaitForTransaction({
    hash,
    enabled: !(hash == null)
  })

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
    error
  } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers,
    onSuccess: (data) => {
      setListen(true)
      setHash(data.hash)
    }
  })

  return (
    <Box my='10px'>
      <RegistrationInputWithTitle
        title='Transfer ETH to the server in order to - this is an explanatory text about funding relay and how it works.'
        label='Funding amount (Recommended amount 0.5 ETH)'
        buttonText='Fund relay'
        isLoading={isLoading}
        isLoadingForTransaction={isLoadingForTransaction}
        isSuccess={isSuccess}
        error={prepareFundTxError?.message ?? error?.message}
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
