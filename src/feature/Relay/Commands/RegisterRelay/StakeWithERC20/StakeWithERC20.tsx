import { useEffect, useState, createContext } from 'react'
import { ethers, constants } from 'ethers'
import { useAccount, useContract, useContractRead, useBlockNumber, useProvider, useNetwork, useToken } from 'wagmi'

import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
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

import RelayHub from '../../../../../contracts/RelayHub.json'
import StakeManager from '../../../../../contracts/StakeManager.json'

import { ChainWithGsn } from '../../../../../types'
import StakeAddedListener from './StakeAddedListener'
import { useFormik } from 'formik'

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
      onSubmit: values => {
        setToken(values.token)
      }
    })

    const TokenSelectOption = ({ address }: { address: string }) => {
      const { data: tokenData } = useToken({
        address: address as any,
        chainId
      })

      // TODO?: truncate address
      return <option value={address}>{tokenData?.name} ({tokenData?.symbol})</option>
    }

    const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)
    return (
      <Form onSubmit={getTokenAddress.handleSubmit}>
        <Form.Label htmlFor="url">
          Select ERC20 token address
        </Form.Label>
        <Row>
          <Col md={2}>
            <Form.Select
              id="token"
              name="token"
              onChange={getTokenAddress.handleChange}
              value={getTokenAddress.values.token}
            >
              <option value="">Suggested: {chain.stakingTokens?.length !== undefined && chain.stakingTokens?.length > 0
                ? chain.stakingTokens?.length
                : 'none.'
              }</option>
              {chain.stakingTokens?.map((address) => {
                return <TokenSelectOption key={address} address={address} />
              })}
            </Form.Select>
          </Col> -
          <Col md={6}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                name="token"
                onChange={getTokenAddress.handleChange}
                value={getTokenAddress.values.token}
                placeholder="0x..."
                aria-label="Address"
              />
            </InputGroup>
          </Col>
        </Row>
        <br />
        <Button disabled={!isAddress} variant="success" type="submit">Fetch token data</Button>
      </Form>
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
    let content

    const preprequisitesFulfilled = (token !== null && address !== undefined && minimumStakeForToken !== null)
    if (preprequisitesFulfilled && !minimumStakeForToken?.isZero()) {
      content = <TokenContext.Provider value={{
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
      content = <>
        <SwitchTokenButton />
        <br />
        <span>This ERC20 Token is not supported</span>
      </>
    } else {
      if (address === undefined) { content = <span>unable to get connected account address</span> }
      if (token === null) {
        content = <>
          <TokenAddressForm />
          <br />
          {chain.stakingTokens === undefined
            ? <FindFirstTokenButton />
            : null
          }
        </>
      }
      if (token !== null && minimumStakeForToken === null) {
        content = <span>Loading staking token data{' '}<Spinner animation="grow" size="sm" /></span>
      }
    }

    if (content === undefined) { content = <span>Could not set up staking menu</span> }
    return content
  }

  return getStakingView()
}
