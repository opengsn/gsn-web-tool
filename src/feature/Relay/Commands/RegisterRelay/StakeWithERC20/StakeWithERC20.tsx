/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import { useEffect, useState, createContext } from 'react'
import { ethers, constants } from 'ethers'
import { useAccount, useContract, useContractRead, useBlockNumber, useProvider, useNetwork, useToken } from 'wagmi'

import { toast } from 'react-toastify'

import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'

import Approver from './Approver/Approve'
import Minter from './Minter/Minter'
import Staker from './Staker'
import StakingTokenInfo from './StakingTokenInfo'

import { isLocalHost, isSameAddress, toNumber } from '../../../../../utils'

import RelayHub from '../../../../../contracts/RelayHub.json'
import StakeManager from '../../../../../contracts/StakeManager.json'

import { ChainWithGsn } from '../../../../../types'
import StakeAddedListener from './StakeAddedListener'
import { useFormik } from 'formik'
import { Box, Button, ButtonType, Icon, Typography, VariantType } from '../../../../../components/atoms'
import { colors } from '../../../../../theme'
import TokenSelectOption from './TokenSelectOption'
import SuggestedTokenFromServer from './TokenSelection/SuggestedTokenFromServer'
import InsertERC20TokenAddress from './TokenSelection/InsertERC20TokenAddress'
import Paper from '../../../../../components/atoms/Paper'

export interface TokenContextInterface {
  chainId: number
  token: string
  account: string
  minimumStakeForToken: ethers.BigNumber
  stakeManagerAddress: string
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TokenContext = createContext<TokenContextInterface>({} as TokenContextInterface)

interface IProps {
  success: boolean
}

export default function StakeWithERC20({ success }: IProps) {
  const currentStep = useAppSelector((state) => state.register.step)
  const [token, setToken] = useState<string | null>(null)
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null)
  const [listen, setListen] = useState(false)
  const relay = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relay.chainId)

  const { address } = useAccount()
  const { chain: chainData } = useNetwork()
  const chain = chainData as unknown as ChainWithGsn

  const { relayManagerAddress, relayHubAddress } = relay

  const provider = useProvider()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const relayHub = useContract({
    address: relayHubAddress,
    abi: RelayHub.abi,
    signerOrProvider: provider
  })!

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const { data: newStakeInfoData } = useContractRead({
    address: stakeManagerAddress,
    abi: StakeManager.abi,
    args: [relayManagerAddress],
    chainId,
    functionName: 'getStakeInfo'
  })

  const { data: curBlockData } = useBlockNumber({
    watch: false,
    chainId
  })

  const handleFindFirstTokenButton = async () => {
    if (curBlockData !== undefined) {
      const fromBlock = (await relayHub.functions.getCreationBlock())[0]
      const toBlock = Math.min(toNumber(fromBlock) + 2048, curBlockData)

      const filters = relayHub.filters.StakingTokenDataChanged()
      const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock)

      if (tokens.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        throw new Error(`no registered staking tokens on relayhub ${relayHub.address as string}`)
      }
      const foundToken = tokens[0]?.args?.token
      return foundToken
    }
  }

  const TokenAddressForm = () => {
    const [radioValue, setRadioValue] = useState(0)
    const getTokenAddress = useFormik({
      initialValues: {
        token: ''
      },
      onSubmit: async (values) => {
        if (radioValue === 2) {
          const token = await handleFindFirstTokenButton()
          setToken(token)
        }
        setToken(values.token)
      }
    })

    const handleChangeToken = (address: string) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getTokenAddress.setFieldValue('token', address)
    }

    const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)

    const elements = [
      {
        label: 'Suggested Tokens from server',
        children: (
          <SuggestedTokenFromServer
            chainId={chainId}
            handleChangeToken={handleChangeToken}
            chain={chain}
            getTokenAddress={getTokenAddress}
          />
        ),
        disabled: radioValue !== 0,
        show: chain.stakingTokens?.length !== undefined && chain.stakingTokens?.length > 0
      },
      {
        label: 'Insert ERC20 token address',
        children: <InsertERC20TokenAddress handleChangeToken={handleChangeToken} />,
        disabled: radioValue !== 1,
        show: true
      },
      {
        label: 'Fetch first available token',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        children: <></>,
        disabled: radioValue !== 2,
        show: true
      }
    ]

    return (
      <Box component='form' onSubmit={getTokenAddress.handleSubmit}>
        {isLocalHost ? (
          <Box>
            {elements.map((element, index) => {
              if (element.show) {
                return (
                  <Paper elevation={radioValue === index ? 5 : 2}>
                    <Box my={4} p={4}>
                      <Box display='flex' key={index}>
                        <Box>
                          <Button.Radio
                            checked={radioValue === index}
                            onChange={() => {
                              setRadioValue(index)
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography>{element.label}</Typography>
                          {element.children}
                          <Box mt={2} width='200px'>
                            <Button.Contained disabled={element.disabled} size='large' type={ButtonType.SUBMIT}>
                              Fetch Token
                            </Button.Contained>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )
              }
              return <></>
            })}
          </Box>
        ) : (
          <Box>
            <Box>
              <Typography>{elements[0].label}</Typography>
              {elements[0].children}
            </Box>
            <Box>
              <Button.Contained type={ButtonType.SUBMIT}>Fetch Token</Button.Contained>
            </Box>
          </Box>
        )}
      </Box>
    )
  }

  useEffect(() => {
    if (newStakeInfoData !== undefined && address !== undefined) {
      const newStakeInfo = (newStakeInfoData as any)[0]

      if (newStakeInfo?.owner !== constants.AddressZero && isSameAddress(newStakeInfo?.owner, address)) {
        if (newStakeInfo?.token !== constants.AddressZero) {
          setToken(newStakeInfo.token)
        }
      }
    }
  }, [newStakeInfoData, address])

  useEffect(() => {
    if (token !== null) {
      const fetchMinimumStakeForToken = async () => {
        const minimumStake = await relayHub.functions.getMinimumStakePerToken(token)
        console.log('minimumStake', minimumStake)
        setMinimumStakeForToken(minimumStake[0])
      }

      fetchMinimumStakeForToken().catch((e) => {
        console.error(e.message)
        toast.error(
          <>
            <p>Error while fetching minimum stake for token</p>
            <p>See console for error message</p>
          </>
        )
      })
    }
  }, [token, relayHub.functions])

  const SwitchTokenButton = () => {
    const handleSwitchToken = () => setToken(null)

    return (
      <Box width='200px'>
        <Button.Contained onClick={handleSwitchToken}>Switch Token</Button.Contained>
      </Box>
    )
  }

  const getStakingView = () => {
    let content

    const preprequisitesFulfilled = token !== null && address !== undefined && minimumStakeForToken !== null
    if (preprequisitesFulfilled && !minimumStakeForToken?.isZero()) {
      content = (
        <TokenContext.Provider
          value={{
            chainId,
            token,
            account: address,
            minimumStakeForToken,
            stakeManagerAddress,
            listen,
            setListen
          }}
        >
          <div>
            <StakingTokenInfo />
          </div>
          <SwitchTokenButton />
          <hr />
          {currentStep === 1 ? (
            <>
              <Minter />
              <br />
            </>
          ) : null}
          {currentStep === 2 ? (
            <>
              <Approver />
              <br />
              <Staker />
              <StakeAddedListener />
            </>
          ) : null}
        </TokenContext.Provider>
      )
    } else if (minimumStakeForToken?.isZero() === true) {
      console.log('minimumStakeForToken', minimumStakeForToken)
      content = (
        <>
          <SwitchTokenButton />
          <br />
          <span>This ERC20 Token is not supported</span>
        </>
      )
    } else {
      if (address === undefined) {
        content = <span>unable to get connected account address</span>
      }
      if (token === null) {
        content = (
          <>
            <TokenAddressForm />
          </>
        )
      }
      if (token !== null && minimumStakeForToken === null) {
        content = <span>Loading staking token data</span>
      }
    }

    if (content === undefined) {
      content = <span>Could not set up staking menu</span>
    }
    return content
  }

  return getStakingView()
}
