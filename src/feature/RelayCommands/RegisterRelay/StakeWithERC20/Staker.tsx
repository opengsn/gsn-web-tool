import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useAccount, useBalance, useContractWrite, useToken } from 'wagmi'
import { TokenContext } from './StakeWithERC20'

import Button from 'react-bootstrap/Button'
import LoadingButton from '../../../../components/LoadingButton'

import StakeManagerAbi from '../../../../contracts/stakeManager.json'
import { useAppSelector } from '../../../../hooks'
import ErrorButton from '../../../../components/ErrorButton'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'

export default function Stake () {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { token, minimumStakeForToken, stakeManagerAddress, setListen } = useContext(TokenContext)
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress } = relay

  const { address } = useAccount()

  const { data: tokenBalanceData } = useBalance({ addressOrName: address, token: token })

  const text = 'Stake'
  const unstakeDelay = '15000'

  const { error: stakeTxError, isSuccess, isError, isLoading, write: stakeRelayer } = useContractWrite(
    {
      addressOrName: stakeManagerAddress,
      contractInterface: StakeManagerAbi,
      functionName: 'stakeForRelayManager',
      args: [token, relayManagerAddress, unstakeDelay, minimumStakeForToken],
      onSuccess (data) {
        const text = 'Staked relay'
        toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
        setListen(true)
      },
      ...defaultStateSwitchers
    }
  )

  let content
  switch (true) {
    case isError:
      content = <ErrorButton message={stakeTxError?.message} onClick={() => stakeRelayer()}>{text}</ErrorButton>
      break
    case isLoading:
      content = <LoadingButton />
      break
    case isSuccess:
      content = <div>Relayer successfully staked</div>
      break
    default:
      content = <Button onClick={() => stakeRelayer()} className="my-2">{text}</Button>
  }

  return (
    <div>
      {content}
    </div>
  )
}
