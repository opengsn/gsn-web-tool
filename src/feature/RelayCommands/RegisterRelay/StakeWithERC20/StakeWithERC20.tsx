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

import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'

import StakingTokenInfo from './StakingTokenInfo'
import Minter from './Minter/Minter'
import Approver from './Approver/Approve'
import Staker from './Staker'

import { toNumber, isSameAddress } from '../../../../utils/utils'

import relayHubAbi from '../../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../../contracts/stakeManager.json'

import { useFormik } from 'formik'
import StakeAddedListener from './StakeAddedListener'
import { ChainWithGsn } from '../../../../networks'

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
  const [stakingTokenIsSet, setStakingTokenIsSet] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null)
  const [stakeManagerOwnerIsSet, setStakeManagerOwnerIsSet] = useState(false)
  const [listen, setListen] = useState(false)

  const { chain: chainData } = useNetwork()
  const chain = chainData as unknown as ChainWithGsn

  // useEffect(() => {
  //   if (chain.stakingTokens === undefined) return
  //   setToken(chain.)
  // }, [chain])

  const relay = useAppSelector((state) => state.relay.relay)
  const { address } = useAccount()

  const {
    relayManagerAddress,
    ownerAddress: owner,
    relayHubAddress
  } = relay
  const chainId = Number(relay.chainId)

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
    functionName: 'getStakeInfo'
  })

  const { data: curBlockData } = useBlockNumber({
    watch: false,
    enabled: false
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
        address,
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
              disabled={stakingTokenIsSet}
              onChange={getTokenAddress.handleChange}
              value={getTokenAddress.values.token}
            >
              <option value="">Suggested: {chain.stakingTokens?.length !== undefined && chain.stakingTokens?.length > 0
                ? chain.stakingTokens?.length
                : '0'
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
                disabled={stakingTokenIsSet}
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

  useEffect(() => {
    if (newStakeInfoData !== undefined && address !== undefined) {
      const newStakeInfo = newStakeInfoData[0]

      if (newStakeInfo?.owner !== constants.AddressZero && isSameAddress(newStakeInfo?.owner, address)) {
        if (newStakeInfo?.token !== constants.AddressZero) {
          setToken(newStakeInfo.token)
          setStakingTokenIsSet(true)
        }
        setStakeManagerOwnerIsSet(true)
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

  const WaitingMessage = () => (
    <>
      <span>Waiting for Stake Manager to set Relay Manager {relayManagerAddress} as owner...
        <Spinner animation="grow" size="sm" />
      </span>
      <br />
      <span>Is relay funded?</span>
    </>
  )

  if (address !== undefined) {
    const isAddressRelayOwner = (owner !== constants.AddressZero && isSameAddress(owner, address))

    if (!isAddressRelayOwner) {
      return <div>- The relay is already owned by {owner}, our data.address={address}</div>
    }
  }

  if (!stakeManagerOwnerIsSet) return (<WaitingMessage />)

  if (token !== null && address !== undefined && minimumStakeForToken !== null) {
    if (minimumStakeForToken?.isZero() && !listen) {
      return (
        <>
          <SwitchTokenButton />
          <br />
          <span>This ERC20 Token is not supported</span>
        </>
      )
    }
    return (
      <>
        <TokenContext.Provider value={{
          chainId,
          token,
          account: address,
          minimumStakeForToken,
          stakeManagerAddress,
          listen,
          setListen
        }}>
          <div><StakingTokenInfo /></div>
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
      </>
    )
  }

  if (token === null) {
    return (
      <>
        <TokenAddressForm />
        <br />
        {chain.stakingTokens === undefined
          ? <FindFirstTokenButton />
          : null
        }

      </>
    )
  }

  if (address === undefined) { return <span>Could not load account data</span> }
  if (minimumStakeForToken === null) {
    return <span>Loading staking token data<Spinner animation="grow" size="sm" /></span>
  }

  return <span>Could not set up staking menu</span>
}
