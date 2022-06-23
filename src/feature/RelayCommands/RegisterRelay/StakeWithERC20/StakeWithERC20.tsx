import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { useAccount, useContract, useBlockNumber, useProvider } from "wagmi";

import Spinner from "react-bootstrap/Spinner";

import { useAppSelector, useStakeInfo, useStakeManagerAddress } from "../../../../hooks";

import TokenInfo from "./TokenInfo";
import Mint from "./Mint";
import Approve from "./Approve";
import Stake from "./Stake";

import { toNumber } from "@opengsn/common";
import { constants } from "@opengsn/common/dist/Constants";
import { isSameAddress } from "@opengsn/common/dist/Utils";

import relayHubAbi from "../../../../contracts/relayHub.json";

import { Address } from "@opengsn/common/dist/types/Aliases";

export interface TokenContextInterface {
  token: Address;
  account: Address;
  minimumStakeForToken: ethers.BigNumber;
}

export const TokenContext = createContext<TokenContextInterface>({} as TokenContextInterface);

export default function StakeWithERC20() {
  const [token, setToken] = useState<Address | null>(null);
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null);
  const [stakeManagerOwnerIsSet, setStakeManagerOwnerIsSet] = useState(false);

  const relay = useAppSelector((state) => state.relay.relay);
  const { data: accountData } = useAccount();
  const account = accountData?.address;
  const {
    relayManagerAddress,
    ownerAddress: owner,
    relayHubAddress,
  } = relay;

  const provider = useProvider();
  const relayHub = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi,
    signerOrProvider: provider,
  });

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress);

  const stakeManagerAddress = stakeManagerAddressData as unknown as string;

  const { data: newStakeInfoData } = useStakeInfo(stakeManagerAddress, relayManagerAddress);

  useBlockNumber({
    watch: false,
    enabled: false,
    onSuccess(data) {
      findFirstToken(data);
    },
  });

  const findFirstToken = async (curBlockNumber: number) => {
    const fromBlock = (await relayHub.functions.getCreationBlock())[0];
    const toBlock = Math.min(toNumber(fromBlock) + 5000, curBlockNumber);

    const filters = relayHub.filters.StakingTokenDataChanged();
    const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock);

    if (tokens.length === 0) {
      throw new Error(`no registered staking tokens on relayhub ${relayHub.address}`);
    }
    const foundToken = tokens[0].args.token;

    setToken(foundToken);
  };

  useEffect(() => {
    if (newStakeInfoData !== undefined && account !== undefined) {
      const newStakeInfo = newStakeInfoData[0];

      if (newStakeInfo?.owner !== constants.ZERO_ADDRESS && isSameAddress(newStakeInfo?.owner, account)) {
        setStakeManagerOwnerIsSet(true);
      }
    }
  }, [newStakeInfoData]);

  useEffect(() => {
    if (token !== null) {
      const fetchMinimumStakeForToken = async () => {
        const minimumStake = await relayHub.functions.getMinimumStakePerToken(token);

        setMinimumStakeForToken(minimumStake);
      };

      fetchMinimumStakeForToken();
    }
  }, [token]);

  const WaitingMessage = () => (
    <div>
      <span>Waiting for Stake Manager to set Relay Manager {relayManagerAddress} as owner...  <Spinner animation="grow" size="sm" /></span>
      <br />
      <span>Is relay funded?</span>
    </div>
  );

  if (account !== undefined) {
    const isAccountRelayOwner = (owner !== constants.ZERO_ADDRESS && isSameAddress(owner, account));

    if (!isAccountRelayOwner) {
      return <div>- The relay is already owned by {owner}, our data.address={account}</div>;
    }
  }

  if (!stakeManagerOwnerIsSet) return (<WaitingMessage />);
  if (token !== null && account !== undefined && minimumStakeForToken !== null) {
    return (
      <>
        <TokenContext.Provider value={{ token: token, account: account, minimumStakeForToken: minimumStakeForToken }}>
          <TokenInfo />
          <Mint />
          <Approve />
          <Stake />
        </TokenContext.Provider>
      </>
    );
  }

  if (token === null) { return <span>Could not fetch tokendata</span>; }
  if (account === undefined) { return <span>Could not fetch token data</span>; }
  if (minimumStakeForToken === null) { return <span>Could not fetch token data</span>; }

  return <span>Could not set up staking menu</span>;
}
