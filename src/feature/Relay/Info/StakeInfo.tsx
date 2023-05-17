import { useContractRead } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { validateConfigOwnerInLineWithStakeManager } from '../relaySlice'
import StakeManager from '../../../contracts/StakeManager.json'
import StakingToken from './StakeManagerInfo/StakingToken'
import { TableCell, TableRow, Typography } from '../../../components/atoms'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()
  const { data: stakeInfo } = useContractRead({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    functionName: 'getStakeInfo',
    args: [relayManagerAddress],
    enabled: relayManagerAddress !== '',
    watch: true,
    chainId,
    onSuccess(data) {
      dispatch(validateConfigOwnerInLineWithStakeManager((data as any)[0].owner))
    }
  })

  if (stakeInfo !== undefined) {
    const { token } = (stakeInfo as any)[0]
    return <StakingToken stakingToken={token} chainId={chainId} />
  }

  const LoadingRow = (
    <TableRow>
      <TableCell>
        <Typography variant={'subtitle2'}>Loading...</Typography>
      </TableCell>
    </TableRow>
  )
  return <>{LoadingRow}</>
}
