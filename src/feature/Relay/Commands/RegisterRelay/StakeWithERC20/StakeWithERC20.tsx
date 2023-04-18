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

  const TokenAddressForm = () => {
    const getTokenAddress = useFormik({
      initialValues: {
        token: ''
      },
      onSubmit: (values) => {
        setToken(values.token)
      }
    })

    const handleChangeToken = (address: string) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getTokenAddress.setFieldValue('token', address)
    }

    const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)

    return (
      <Box component='form' onSubmit={getTokenAddress.handleSubmit}>
        <Typography>Suggested Tokens from server</Typography> &nbsp;
        <Button.Icon onClick={() => {}}>
          <Icon.Info fill={colors.black} width='16px' height='16px' />
        </Button.Icon>
        <Box>
          <Typography variant={VariantType.XSMALL}>Select token from list:</Typography>
        </Box>
        {chain.stakingTokens?.map((stakingToken) => {
          return (
            <TokenSelectOption
              key={stakingToken}
              address={stakingToken}
              chainId={chainId}
              handleChangeToken={handleChangeToken}
              checked={getTokenAddress.values.token === stakingToken}
            />
          )
        })}
        <Box width='180px' height='60px' mt='20px'>
          <Button.Contained type={ButtonType.SUBMIT}>
            <Typography variant={VariantType.H6}>Fetch token</Typography>
          </Button.Contained>
        </Box>
      </Box>
    )
  }

  const FindFirstTokenButton = () => {
    const findFirstToken = async (curBlockNumber: number) => {
      const fromBlock = (await relayHub.functions.getCreationBlock())[0]
      const toBlock = Math.min(toNumber(fromBlock) + 2048, curBlockNumber)

      const filters = relayHub.filters.StakingTokenDataChanged()
      const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock)

      if (tokens.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        throw new Error(`no registered staking tokens on relayhub ${relayHub.address as string}`)
      }
      const foundToken = tokens[0]?.args?.token

      return foundToken
    }

    const handleFindFirstTokenButton = () => {
      if (curBlockData !== undefined) {
        findFirstToken(curBlockData)
          .then(setToken)
          .catch((e) => {
            console.error(e.message)
            toast.error(
              <>
                <p>Error while fetching first available token</p>
                <p>See console for error message</p>
              </>
            )
          })
      }
    }

    return <></>
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

    return <Button.Contained onClick={handleSwitchToken}>Switch Token</Button.Contained>
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
            <br />
            {chain.stakingTokens === undefined ? <FindFirstTokenButton /> : null}
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
