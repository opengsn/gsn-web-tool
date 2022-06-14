import {useEffect, useState} from "react";
import {toNumber} from "@opengsn/common";
import {useToken, useContractRead, useAccount, useContract, useBlockNumber, useProvider} from "wagmi";


import {useAppSelector, useAppDispatch} from "../../../../hooks";

import Mint from "./Mint";
import Approve from "./Approve";
import Stake from "./Stake";

import {constants} from "@opengsn/common/dist/Constants";
import {isSameAddress} from "@opengsn/common/dist/Utils";

import relayHubAbi from "../../../../contracts/relayHub.json";
import StakeManagerAbi from "../../../../contracts/stakeManager.json";

import {Address} from "@opengsn/common/dist/types/Aliases";

export default function StakeWithERC20() {
  const [token, setToken] = useState('Loading..');
  const [stakeManagerOwnerIsSet, setStakeManagerOwnerIsSet] = useState(false);

  const relay = useAppSelector((state) => state.relay.relay);

  const {
    relayManagerAddress: relayAddress,
    ownerAddress: owner,
    relayHubAddress
  } = relay;

  const provider = useProvider()
  const relayHub = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi,
    signerOrProvider: provider
  });

  const {data: stakeManagerAddressData} = useContractRead({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi
  }, 'getStakeManager');

  const stakeManagerAddress = stakeManagerAddressData as unknown as string;

  const {data: newStakeInfoData} = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi
  }, 'getStakeInfo', {args: relayAddress, watch: true});



  let account: string = "unknown";
  const {data: accountData} = useAccount();
  if (accountData?.address !== undefined) {
    account = accountData.address
  }

  const {
    data: blockNumberData,
    isFetched: blockNumberFetched,
    fetchStatus
  } = useBlockNumber({
    watch: false,
    enabled: false,
    onSuccess(data) {
      findFirstToken(data)
    }
  })

  // const {data: stakingToken} = useToken

  const findFirstToken = async (curBlockNumber: number) => {
    const fromBlock = (await relayHub.functions.getCreationBlock())[0]
    const toBlock = Math.min(toNumber(fromBlock) + 5000, curBlockNumber)

    const filters = relayHub.filters.StakingTokenDataChanged();
    const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock);
    if (tokens.length === 0) {
      throw new Error(`no registered staking tokens on relayhub ${relayHub.address}`)
    }
    const token = tokens[0].args.token
    setToken(token);
  }

  // TODO
  const getStakingTokenRequirements = async (token: Address) => {
  };

  useEffect(() => {
    if (newStakeInfoData !== undefined) {
      const newStakeInfo = newStakeInfoData[0];
      if (newStakeInfo?.owner !== constants.ZERO_ADDRESS && isSameAddress(newStakeInfo?.owner, account)) {
        setStakeManagerOwnerIsSet(true)
        console.log('RelayServer successfully set its owner on the StakeManager')
      }
    }
  }, [newStakeInfoData])

  useEffect(() => {
    getStakingTokenRequirements(token)
  }, [token])

  return (
    <>
      {stakeManagerOwnerIsSet ?
        <>
          <span>Using token: {token}</span>
          <Mint token={token} account={account} />
          <br />
          <Approve token={token} stakeManagerAddress={stakeManagerAddress} account={account} />
          <br />
          <Stake token={token} account={account} stakeManagerAddress={stakeManagerAddress}
            relayAddress={relayAddress} />
          <br />
        </>
        :
        <span>Relay Manager not yet set as owner in Stake Manager</span>
      }
      <hr />
    </>
  )

}

