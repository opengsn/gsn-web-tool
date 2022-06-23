import { useContext } from "react";
import { useContractWrite } from "wagmi";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

import { TokenContext } from "./StakeWithERC20";
import ErrorButton from "../../../../components/ErrorButton";
import LoadingButton from "../../../../components/LoadingButton";

import iErc20TokenAbi from "@opengsn/common/dist/interfaces/IERC20Token.json";
import { useStakeManagerAddress, useAppSelector } from "../../../../hooks";

export default function Approve() {
  const relay = useAppSelector((state) => state.relay.relay);
  const { relayHubAddress } = relay;
  // TODO: approve amount outstanding
  // const { token, account } = useContext(TokenContext);
  const { token } = useContext(TokenContext);

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress);
  const stakeManagerAddress = stakeManagerAddressData as unknown as string;

  const text = <span>Approve (value) (symbol) for spend</span>;

  const { error: approveTxError, isSuccess, isError, isLoading, write: approve } = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi,
    },
    "approve",
    { args: [stakeManagerAddress, ethers.utils.parseEther("1.0")] },
  );

  if (isLoading) return <LoadingButton />;
  if (isError) return <ErrorButton message={approveTxError?.message} onClick={() => approve()}>{text}</ErrorButton>;
  if (isSuccess) return <div>Succesfully increased allowance</div>;

  return (<Button onClick={() => approve()}>{text}</Button>);
}
