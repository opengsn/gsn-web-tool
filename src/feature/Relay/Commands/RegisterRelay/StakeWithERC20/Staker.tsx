import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { TokenContext } from './StakeWithERC20'

import Button from 'react-bootstrap/Button'

import ErrorButton from '../../../components/ErrorButton'
import LoadingButton from '../../../components/LoadingButton'
import TransactionSuccessToast from '../../../components/TransactionSuccessToast'

import iErc20TokenAbi from '../../../../../contracts/iERC20TokenAbi.json'
import StakeManagerAbi from '../../../../../contracts/stakeManager.json'
import { useAppSelector } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'

export default function Stake () {
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { address } = useAccount()
  const { token, minimumStakeForToken, stakeManagerAddress, setListen } = useContext(TokenContext)
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress } = relay
  const chainId = Number(relay.chainId)

  const unstakeDelay = '15000'

  const { config, error: prepareStakeTxError, refetch } = usePrepareContractWrite({
    address: stakeManagerAddress as any,
    abi: StakeManagerAbi,
    functionName: 'stakeForRelayManager',
    args: [token, relayManagerAddress, unstakeDelay, minimumStakeForToken]
  })

  useContractRead({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'allowance',
    args: [address, stakeManagerAddress],
    watch: true,
    chainId,
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

  const getStakeButton = () => {
    let content
    const text = 'Stake'
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
                <span className="text-dark">Account is not prepared for staking. Please try increasing allowance</span>
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

    if (content === undefined) return <span>unable to initialize stake button</span>
    return content
  }

  return <div>{getStakeButton()}</div>
}
