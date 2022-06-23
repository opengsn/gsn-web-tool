import { useContext } from "react";
import { useContractWrite, useBalance } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import { TokenContext } from "./StakeWithERC20";
import LoadingButton from "../../../../components/LoadingButton";
import ErrorButton from "../../../../components/ErrorButton";

import iErc20TokenAbi from "@opengsn/common/dist/interfaces/IERC20Token.json";

export default function Mint() {
  const { token, account } = useContext(TokenContext);

  const { error: mintTokenError, isSuccess, isError, isLoading, write: mintToken } = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi,
    },
    "deposit",
    {
      overrides: { value: ethers.utils.parseEther("1.0") },
      onSuccess(data) {
        toast.info(`Coins minted with tx ${data.hash}`);
      },
    },
  );

  const { data: bal } = useBalance({ addressOrName: account, token: token, staleTime: 32000, watch: true });
  const text = <span>Mint {bal?.symbol}</span>;

  const MintButton = () => {

    if (isError) return (<ErrorButton message={mintTokenError?.message} onClick={() => mintToken()}><span>Retry {text}</span></ErrorButton>);
    if (isLoading) return <LoadingButton />;
    if (isSuccess) return <div>Transaction dispatched. Waiting for confirmations...</div>;

    return <Button onClick={() => mintToken()} className="my-2">{text}</Button>;
  };

  return (
    <div>
      <MintButton />
    </div>
  );
}
