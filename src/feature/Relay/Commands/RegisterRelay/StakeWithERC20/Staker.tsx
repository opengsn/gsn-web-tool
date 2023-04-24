import { useContext, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { TokenContext } from './TokenContextWrapper'

import iErc20TokenAbi from '../../../../../contracts/iERC20TokenAbi.json'
import StakeManager from '../../../../../contracts/StakeManager.json'
import { useAppSelector } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import RegistrationInputWithTitle from '../../../../../components/molecules/RegistrationInputWithTitle'
import { Alert } from '../../../../../components/atoms'
import CopyHash from '../../../../../components/atoms/CopyHash'

interface IProps {
  success: boolean
}

export default function Staker({ success }: IProps) {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { address } = useAccount()
  const [hash, setHash] = useState<string>()
  const { token, minimumStakeForToken, stakeManagerAddress, setListen } = useContext(TokenContext)
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress } = relay
  const chainId = Number(relay.chainId)

  const unstakeDelay = '15000'

  const {
    config,
    error: prepareStakeTxError,
    refetch,
    isLoading: isPrepareStakeTxLoading
  } = usePrepareContractWrite({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    functionName: 'stakeForRelayManager',
    args: [token, relayManagerAddress, unstakeDelay, minimumStakeForToken]
  })

  const { isLoading: contractReadLoading } = useContractRead({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'allowance',
    args: [address, stakeManagerAddress],
    watch: true,
    chainId,
    onSuccess() {
      refetch().catch(console.error)
    }
  })

  const {
    error: stakeTxError,
    isSuccess,
    isLoading,
    write: stakeRelayer
  } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess(data) {
      setHash(data.hash)
      setListen(true)
    }
  })

  if (success) <CopyHash copyValue={hash} />

  return (
    <>
      <RegistrationInputWithTitle
        title='This is a short explanatory text about staking, and the process now happening, and what should be confirmed on the wallet extension.'
        buttonText='Stake'
        isLoading={isLoading || isPrepareStakeTxLoading || contractReadLoading}
        isSuccess={isSuccess}
        error={stakeTxError?.message}
        onClick={() => stakeRelayer?.()}
      />
      {prepareStakeTxError !== null && (
        <Alert severity='error'>Account is not prepared for staking. Please try increasing allowance - {prepareStakeTxError.message}</Alert>
      )}
    </>
  )
}
