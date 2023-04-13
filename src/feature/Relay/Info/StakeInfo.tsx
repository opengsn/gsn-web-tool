import { useAccount, useContractRead } from 'wagmi'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { isSameAddress } from '../../../utils'

import { validateConfigOwnerInLineWithStakeManager } from '../relaySlice'

import StakeManager from '../../../contracts/StakeManager.json'
import StakingToken from './StakeManagerInfo/StakingToken'
import { TableCell, TableRow, Typography, VariantType } from '../../../components/atoms'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const { data: stakeInfo, isSuccess } = useContractRead({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    functionName: 'getStakeInfo',
    args: [relayManagerAddress],
    chainId,
    watch: false,
    onSuccess(data) {
      dispatch(validateConfigOwnerInLineWithStakeManager((data as any)[0].owner))
    },
    onError(err) {
      console.log('error fetching data from stake manager.', { cause: err })
    }
  })

  if (stakeInfo !== undefined && isSuccess) {
    const { owner, token } = (stakeInfo as any)[0]
    const ShowOwner = () => {
      if (address !== undefined && isSameAddress(address, owner)) {
        return <b>currently connected</b>
      } else {
        return <b>not the connected account</b>
      }
    }

    return (
      <>
        <TableRow>
          <TableCell>
            <Typography variant={VariantType.H6}>Current Owner</Typography>
          </TableCell>
          <TableCell>
            <Typography variant={VariantType.H6}>{owner}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant={VariantType.H6}>
              <ShowOwner />
            </Typography>
          </TableCell>
        </TableRow>
        <StakingToken stakingToken={token} chainId={chainId} />
      </>
    )
  }

  const LoadingRow = (
    <TableRow>
      <TableCell>
        <Typography variant={VariantType.H6}>Loading info from stakemanager... If , refreshing the page might help</Typography>
      </TableCell>
    </TableRow>
  )
  return <>{LoadingRow}</>
}
