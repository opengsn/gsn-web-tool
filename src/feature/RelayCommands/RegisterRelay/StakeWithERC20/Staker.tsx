import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { TokenContext } from './StakeWithERC20'

import Button from 'react-bootstrap/Button'
import LoadingButton from '../../../../components/LoadingButton'

import iErc20TokenAbi from '@opengsn/common/dist/interfaces/IERC20Token.json'
import StakeManagerAbi from '../../../../contracts/stakeManager.json'
import { useAppSelector } from '../../../../hooks'
import ErrorButton from '../../../../components/ErrorButton'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'

export default function Stake () {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { address } = useAccount()
  const { token, minimumStakeForToken, stakeManagerAddress, setListen } = useContext(TokenContext)
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress } = relay
  const chainId = Number(relay.chainId)

  const text = 'Stake'
  const unstakeDelay = '15000'

  const { config, error: prepareStakeTxError, refetch } = usePrepareContractWrite({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'stakeForRelayManager',
    args: [token, relayManagerAddress, unstakeDelay, minimumStakeForToken]
  })

  useContractRead({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'allowance',
    args: [address, stakeManagerAddress],
    watch: true,
    chainId: chainId,
    onSuccess () {
      refetch().catch(console.error)
    }
  })

  const { error: stakeTxError, isSuccess, isError, isLoading, write: stakeRelayer } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess (data) {
      const text = 'Staked relay'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
      setListen(true)
    }
  })

  let content
  switch (true) {
    case isError:
      content = <ErrorButton message={stakeTxError?.message} onClick={() => stakeRelayer?.()}>{text}</ErrorButton>
      break
    case isLoading:
      content = <LoadingButton />
      break
    case isSuccess:
      content = <div>Relayer successfully staked</div>
      break
    default:
      content = <>
        {prepareStakeTxError !== null
          ? <>
            <div className="p-3 mt-4 my-1 bg-warning">
              <span className="text-dark">Account is not prepared for staking. Try increasing allowance</span>
            </div>

            <Button disabled className="my-2">
              {text}
            </Button>
          </>
          : <Button onClick={() => stakeRelayer?.()} className="my-2">
            {text}
          </Button>
        }
      </>
  }

  return (
    <div>
      {content}
    </div>
  )
}
