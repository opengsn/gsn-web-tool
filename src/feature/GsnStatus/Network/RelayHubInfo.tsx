/* eslint-disable multiline-ternary */
import { Fragment, useEffect, useState } from 'react'
import { useBlockNumber, useContractRead, useProvider } from 'wagmi'

import { BigNumber, Contract, utils } from 'ethers'

import BlockExplorerUrl from '../components/BlockExplorerUrl'
import { TokenValueInfo } from './TokenValueInfo'
import { Box, Typography } from '../../../components/atoms'
import { useTheme } from '@mui/material'
import { Chip } from '../../../components/atoms/Chip'
import { formatNumber } from '../../../utils'

interface RelayHubInfoProps {
  relayHubAddress: string
  RelayHubAbi: any
  blockExplorerUrl: string | undefined
  chainId: number
  activeRelays: number
}

export interface IFoundToken {
  token: string
  minimumStake: BigNumber
}

export default function RelayHubInfo({ relayHubAddress, RelayHubAbi, blockExplorerUrl, chainId, activeRelays }: RelayHubInfoProps) {
  const { data: curBlockNumberData } = useBlockNumber({ chainId })
  const provider = useProvider({ chainId })
  const [stakingTokens, setStakingTokens] = useState<IFoundToken[]>([])
  const theme = useTheme()

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

  useContractRead({
    address: relayHubAddress as any,
    abi: RelayHubAbi,
    functionName: 'versionHub',
    chainId
  })

  function formatDays(secondsTotal: any): string {
    const secNum = parseInt(secondsTotal, 10)
    const days = Math.floor(secNum / (3600 * 24))
    const hours = Math.floor(secNum / 3600)
    const minutes = Math.floor((secNum - hours * 3600) / 60)
    const seconds = secNum - hours * 3600 - minutes * 60

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }
  return (
    <Box mt={5} display='flex' alignItems='center' gap={7}>
      <Box display='flex' alignItems='center' height='24px'>
        <Box>
          <Typography variant='h6' fontWeight={600}>
            Relay Hub:
          </Typography>
          &nbsp;
        </Box>
        <BlockExplorerUrl address={relayHubAddress} url={`${blockExplorerUrl ?? ''}/address/${relayHubAddress}`} />
      </Box>
      {hubStateData !== undefined ? (
        <>
          <Box>
            <Typography variant='h6' fontWeight={600}>
              Stake lock time:
            </Typography>{' '}
            <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
              {formatDays(hubStateData.minimumUnstakeDelay as any)}{' '}
            </Typography>
          </Box>
          {stakingTokens.length > 0 ? (
            <Box>
              <Typography variant='h6' fontWeight={600}>
                Stake token{stakingTokens.length > 1 ? 's' : null}:
              </Typography>{' '}
              <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
                {stakingTokens.map((foundToken: IFoundToken, index: number) => {
                  const lastItem = index === stakingTokens.length - 1
                  return (
                    <Fragment key={index}>
                      <TokenValueInfo
                        token={foundToken.token}
                        minimumStake={foundToken.minimumStake}
                        chainId={chainId}
                        key={foundToken.token}
                      />
                      {lastItem ? null : ', '}
                    </Fragment>
                  )
                })}
              </Typography>
            </Box>
          ) : null}
          <Box>
            <Typography variant='h6' fontWeight={600}>
              Relay Fee:
            </Typography>{' '}
            <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
              <>
                {formatNumber(+utils.formatUnits(hubStateData.baseRelayFee as any, 'gwei'))} gwei + {hubStateData.pctRelayFee}%
              </>
            </Typography>
          </Box>
          <Box>
            <Typography variant='h6' fontWeight={600}>
              Online Networks:
            </Typography>{' '}
          </Box>
          <Box ml={'-10px'}>
            <Chip
              label={
                <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
                  {activeRelays}
                </Typography>
              }
              bgcolor={theme.palette.primary.chipBGSuccess}
            />
          </Box>
        </>
      ) : null}
    </Box>
  )
}
