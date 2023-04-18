import { useContext } from 'react'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { useDefaultStateSwitchers } from '../registerRelayHooks'
import { FunderContext } from './Funder'

import { Box, Button, TextField, Typography, VariantType } from '../../../../../components/atoms'
import { TextFieldType } from '../../../../../components/atoms/TextField'
import { BigNumber, ethers } from 'ethers'
import Alert from '../../../../../components/atoms/Alert'

export default function FundButton() {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { relayManagerAddress, funds, handleChangeFunds, setListen } = useContext(FunderContext)

  const {
    config,
    error: prepareFundTxError,
    isError: prepareIsError
  } = usePrepareSendTransaction({
    request: {
      to: relayManagerAddress,
      value: BigNumber.from(ethers.utils.parseEther(funds.toString()))
    }
  })

  const {
    sendTransaction: fundRelay,
    isLoading,
    isSuccess,
    isError
  } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers,
    onSuccess: () => {
      setListen(true)
    }
  })

  if (isError) return <span>Error while creating FundButton</span>

  return (
    <Box my='10px'>
      <Box mb='5px'>
        <Typography variant={VariantType.H6}>
          Transfer ETH to the server in order to - this is an explanatory text about funding relay and how it works. Learn more{' '}
          {/* learn more */}
        </Typography>
      </Box>
      <Box>
        <Typography variant={VariantType.XSMALL}>Funding amount (Recommended amount 0.5 ETH) </Typography>
      </Box>
      <Box width='400px' mb='10px'>
        <TextField
          type={TextFieldType.Number}
          onChange={(e) => {
            handleChangeFunds(+e.target.value)
          }}
          value={funds.toString()}
          placeholder='Type amount'
        />
      </Box>
      <Box height='60px' width='150px'>
        <Button.Contained disabled={isLoading || isSuccess} onClick={() => fundRelay?.()}>
          <Typography variant={VariantType.H5}>{isLoading || isSuccess ? <>loading...</> : <>Fund relay</>}</Typography>
        </Button.Contained>
      </Box>
      {prepareIsError && <Alert severity='error'>Error: {prepareFundTxError?.message}</Alert>}
    </Box>
  )
}
