import { constants, ethers } from 'ethers'
import { createContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useAccount, useBlockNumber, useContract, useContractRead, useNetwork, useProvider } from 'wagmi'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'

import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'

import Approver from './Approver/Approve'
import Minter from './Minter/Minter'
import Staker from './Staker'
import StakingTokenInfo from './StakingTokenInfo'

import { isSameAddress, toNumber } from '../../../../../utils'

import relayHubAbi from '../../../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../../../contracts/stakeManager.json'

import { ChainWithGsn } from '../../../../../types'
import StakeAddedListener from './StakeAddedListener'

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

export default function StakeWithERC20 () {
  const currentStep = useAppSelector((state) => state.register.step)
  const [token, setToken] = useState<string | null>(null)
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null)
  const [listen, setListen] = useState(false)

  const relay = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relay.chainId)

  const { address } = useAccount()
  const { chain: chainData } = useNetwork()
  const chain = chainData as unknown as ChainWithGsn

  const {
    relayManagerAddress,
    relayHubAddress
  } = relay

  const provider = useProvider()
  const relayHub = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi,
    signerOrProvider: provider
  })

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const { data: newStakeInfoData } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: stakeManagerAbi,
    args: relayManagerAddress,
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
      onSubmit: values => {
        setToken(values.token)
      }
    })

    const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)
    return (
      <Form onSubmit={getTokenAddress.handleSubmit}>
        <Form.Label htmlFor="url">
          ERC20 token address
          <Form.Select
            id="token"
            name="token"
            onChange={getTokenAddress.handleChange}
            value={getTokenAddress.values.token}
          >
            <option value="">Select staking token</option>
            {chain.stakingTokens?.map((x) => {
              return <option key={x} value={x}>{x} {isAddress}</option>
            })}
          </Form.Select>
        </Form.Label>
        <br />
        <Button disabled={!isAddress} variant="success" type="submit">Fetch token data</Button>
      </Form>
    )
  }

  const FindFirstTokenButton = () => {
    const findFirstToken = async (curBlockNumber: number) => {
      const fromBlock = (await relayHub.functions.getCreationBlock())[0]
      const toBlock = Math.min(toNumber(fromBlock) + 5000, curBlockNumber)

      const filters = relayHub.filters.StakingTokenDataChanged()
      const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock)

      if (tokens.length === 0) {
        throw new Error(`no registered staking tokens on relayhub ${relayHub.address as string}`)
      }
      const foundToken = tokens[0].args.token

      return foundToken
    }

    const handleFindFirstTokenButton = () => {
      if (curBlockData !== undefined) {
        findFirstToken(curBlockData).then(setToken).catch((e) => {
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

    return (
      <Button onClick={() => handleFindFirstTokenButton()}>
        Fetch first available token
      </Button>
    )
  }

  useEffect(() => {
    if (newStakeInfoData !== undefined && address !== undefined) {
      const newStakeInfo = newStakeInfoData[0]

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
      <Button onClick={handleSwitchToken} variant='secondary'>
        Switch Token
      </Button>
    )
  }

  const getStakingView = () => {
    const preprequisitesFulfilled = (token !== null && address !== undefined && minimumStakeForToken !== null)
    if (preprequisitesFulfilled && !minimumStakeForToken?.isZero()) {
      <TokenContext.Provider value={{
        chainId,
        token,
        account: address,
        minimumStakeForToken,
        stakeManagerAddress,
        listen,
        setListen
      }}>
        <div>
          <StakingTokenInfo />
        </div>
        <SwitchTokenButton />
        <hr />
        {currentStep === 1
          ? <><Minter />< br /></>
          : null}
        {currentStep === 2
          ? <>
            <Approver />
            <br />
            <Staker />
            <StakeAddedListener />
          </>
          : null}
      </TokenContext.Provider>
    } else if (minimumStakeForToken?.isZero() === true) {
      <>
        <SwitchTokenButton />
        <br />
        <span>This ERC20 Token is not supported</span>
      </>
    } else {
      if (address === undefined) return <span>unable to get connected account address</span>
      if (token === null) {
        <>
          <TokenAddressForm />
          <br />
          {chain.stakingTokens === undefined
            ? <FindFirstTokenButton />
            : null
          }
        </>
      }
      if (minimumStakeForToken === null) {
        <span>Loading staking token data{' '}<Spinner animation="grow" size="sm" /></span>
      }
    }

    return <span>Could not set up staking menu</span>
  }

  return getStakingView()
}
