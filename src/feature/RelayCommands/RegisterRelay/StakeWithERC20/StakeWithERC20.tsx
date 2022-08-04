import { useEffect, useState, createContext } from 'react'
import { ethers } from 'ethers'
import { useAccount, useContract, useContractRead, useBlockNumber, useProvider } from 'wagmi'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'

import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'

import Minter from './Minter/Minter'
import Approver from './Approver/Approve'
import Staker from './Staker'

import { toNumber } from '@opengsn/common'
import { constants } from '@opengsn/common/dist/Constants'
import { isSameAddress } from '@opengsn/common/dist/Utils'

import relayHubAbi from '../../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../../contracts/stakeManager.json'

import { Address } from '@opengsn/common/dist/types/Aliases'
import { useFormik } from 'formik'
import StakeAddedListener from './StakeAddedListener'

export interface TokenContextInterface {
  token: Address
  account: Address
  minimumStakeForToken: ethers.BigNumber
  stakeManagerAddress: Address
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TokenContext = createContext<TokenContextInterface>({} as TokenContextInterface)

export default function StakeWithERC20 () {
  const [token, setToken] = useState<Address | null>(null)
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null)
  const [stakeManagerOwnerIsSet, setStakeManagerOwnerIsSet] = useState(false)
  const [listen, setListen] = useState(false)

  const relay = useAppSelector((state) => state.relay.relay)
  const { address } = useAccount()

  const {
    relayManagerAddress,
    ownerAddress: owner,
    relayHubAddress
  } = relay

  const provider = useProvider()
  const relayHub = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi,
    signerOrProvider: provider
  })

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress)
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

    const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)
    return (
      <Form onSubmit={getTokenAddress.handleSubmit}>
        <Form.Label htmlFor="url">
          ERC20 token address
          <Form.Control
            id="token"
            name="token"
            type="text"
            onChange={getTokenAddress.handleChange}
            value={getTokenAddress.values.token}
          />
        </Form.Label>
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

      if (newStakeInfo?.owner !== constants.ZERO_ADDRESS && isSameAddress(newStakeInfo?.owner, address)) {
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
    const isaddressRelayOwner = (owner !== constants.ZERO_ADDRESS && isSameAddress(owner, address))

    if (!isaddressRelayOwner) {
      return <div>- The relay is already owned by {owner}, our data.address={address}</div>
    }
  }

  if (!stakeManagerOwnerIsSet) return (<WaitingMessage />)

  if (token !== null && address !== undefined && minimumStakeForToken !== null) {
    if (minimumStakeForToken?.isZero()) {
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
        <SwitchTokenButton />
        <hr />
        <TokenContext.Provider value={{
          token: token,
          account: address,
          minimumStakeForToken: minimumStakeForToken,
          stakeManagerAddress: stakeManagerAddress,
          listen: listen,
          setListen: setListen
        }}>
          <Minter />
          <br />
          <Approver />
          <br />
          <Staker />
          <StakeAddedListener />
        </TokenContext.Provider>
      </>
    )
  }

  if (token === null) {
    return (
      <>
        <TokenAddressForm />
        <br />
        <FindFirstTokenButton />
      </>
    )
  }

  if (address === undefined) { return <span>Could not load account data</span> }
  if (minimumStakeForToken === null) {
    return <span>Loading staking token data<Spinner animation="grow" size="sm" /></span>
  }

  return <span>Could not set up staking menu</span>
}
