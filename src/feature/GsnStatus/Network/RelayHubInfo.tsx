/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { useBlockNumber, useContractRead, useProvider } from 'wagmi'

import { BigNumber, Contract, ethers, utils } from 'ethers'

import BlockExplorerUrl from '../components/BlockExplorerUrl'
import { TokenValueInfo } from './TokenValueInfo'
import { Box, Typography } from '../../../components/atoms'

interface RelayHubInfoProps {
  relayHubAddress: string
  RelayHubAbi: any
  blockExplorerUrl: string | undefined
  chainId: number
}

export interface IFoundToken {
  token: string
  minimumStake: BigNumber
}

export default function RelayHubInfo({ relayHubAddress, RelayHubAbi, blockExplorerUrl, chainId }: RelayHubInfoProps) {
  const ver = (version: string) => version.replace(/\+opengsn.*/, '')
  const { data: curBlockNumberData } = useBlockNumber({ chainId })
  const provider = useProvider({ chainId })
  const [stakingTokens, setStakingTokens] = useState<IFoundToken[]>([])

  useEffect(() => {
    if (curBlockNumberData !== undefined) {
      const findFirstToken = async (curBlockNumber: number): Promise<IFoundToken[]> => {
        const relayHub = new Contract(relayHubAddress, RelayHubAbi, provider)
        const fromBlock = (await relayHub.functions.getCreationBlock())[0]
        const fromBlockNr: number = fromBlock.toNumber()
        const toBlock = Math.min(fromBlockNr + 2048, curBlockNumber)

        const filters = relayHub.filters.StakingTokenDataChanged()
        const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock)

        if (tokens.length === 0) {
          throw new Error(`no registered staking tokens on relayhub ${relayHub.address}`)
        }
        const foundTokens = Object.values(tokens).reduce<IFoundToken[]>((tokens, event) => {
          if (event.args !== undefined) {
            const { token, minimumStake } = event.args
            return [...tokens, { token, minimumStake }]
          } else {
            return tokens
          }
        }, [])

        return foundTokens
      }

      findFirstToken(curBlockNumberData).then(setStakingTokens).catch(console.error)
    }
  }, [curBlockNumberData, relayHubAddress, RelayHubAbi, provider])

  const { data: hubStateData } = useContractRead({
    address: relayHubAddress as any,
    abi: RelayHubAbi,
    functionName: 'getConfiguration',
    chainId
  })

  const { data: versionData } = useContractRead({
    address: relayHubAddress as any,
    abi: RelayHubAbi,
    functionName: 'versionHub',
    chainId
  })

  function formatDays(days: ethers.BigNumber) {
    const daysNumber = days.toNumber()
    if (daysNumber > 2) {
      return `${Math.round(daysNumber)} days`
    }
    const hours = daysNumber * 24
    if (hours > 2) {
      return `${Math.round(hours)} hrs`
    }

    const min = hours * 60
    return `${Math.round(min)} mins`
  }

  return (
    <Box mt={4}>
      <Box>
        <Typography variant='body2' fontWeight={600}>
          Relay Hub:{' '}
        </Typography>
        <BlockExplorerUrl address={relayHubAddress} url={blockExplorerUrl} />
      </Box>
      {hubStateData !== undefined ? (
        <>
          <Box>
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
            <Typography variant='body2' fontWeight={600}>
              Stake:
            </Typography>{' '}
            <Typography variant='body2'>lock time {formatDays(hubStateData.minimumUnstakeDelay as any)}.</Typography>
            {stakingTokens.length > 0 ? (
              <>
                <Typography variant='body2' fontWeight={600}>
                  token{stakingTokens.length > 1 ? 's' : null}:
                </Typography>{' '}
                <Typography variant='body2'>
                  {stakingTokens.map((foundToken: IFoundToken) => {
                    return (
                      <TokenValueInfo
                        token={foundToken.token}
                        minimumStake={foundToken.minimumStake}
                        chainId={chainId}
                        key={foundToken.token}
                      />
                    )
                  })}
                </Typography>
              </>
            ) : null}
          </Box>
          <Box>
            <Typography variant='body2' fontWeight={600}>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
              Relay Fee:
            </Typography>{' '}
            <Typography variant='body2'>
              <>
                {utils.formatUnits(hubStateData.baseRelayFee as any, 'gwei')} gwei + {hubStateData.pctRelayFee}%
              </>
            </Typography>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
