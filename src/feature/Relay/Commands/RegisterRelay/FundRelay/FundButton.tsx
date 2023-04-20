import { useContext } from 'react'
import { toast } from 'react-toastify'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { useDefaultStateSwitchers } from '../registerRelayHooks'
import { FunderContext } from './Funder'

import TransactionSuccessToast from '../../../components/TransactionSuccessToast'
import { Box, Button, TextField, Typography, VariantType } from '../../../../../components/atoms'
import { TextFieldType } from '../../../../../components/atoms/TextField'
import { BigNumber, ethers } from 'ethers'

export default function FundButton() {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { relayManagerAddress, funds, setListen, handleChangeFunds } = useContext(FunderContext)

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
    error: fundTxError,
    isIdle,
    isError,
    isLoading,
    isSuccess
  } = useSendTransaction({
    ...config,
    ...defaultStateSwitchers
    // onSuccess(data) {
    //   const text = 'Funded relay.'
    //   toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    //   setListen(true)
    // }
  })

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
        <Button.Contained disabled={isLoading} onClick={() => fundRelay?.()}>
          <Typography variant={VariantType.H5}>Fund relay</Typography>
        </Button.Contained>
      </Box>
    </Box>
  )
}
