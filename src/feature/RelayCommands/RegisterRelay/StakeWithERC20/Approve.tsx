import {useState} from "react";
import {useAppSelector} from "../../../../hooks";
import {ethers} from "ethers";
import Button from "react-bootstrap/Button";
import {useContractWrite, useWaitForTransaction, useBalance, useAccount, useContract, useToken} from 'wagmi';

import iErc20TokenAbi from "@opengsn/common/dist/interfaces/IERC20Token.json"

export default function Approve({token, account, stakeManagerAddress}: any) {
  const {data: approveTxData, isError, isLoading, write: approve} = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi,
    },
    'approve',
    {args: [stakeManagerAddress, ethers.utils.parseEther("1.0")]}
  )
  const {data: waitForApproveTxData, isSuccess} = useWaitForTransaction({
    hash: approveTxData?.hash,
    onSuccess(data) {
      console.log(data)
    }
  })

  // const signer = useSelector((state: RootState) => state.blockchain.provider.getSigner());
  // const account = useSelector((state: RootState) => state.blockchain.account);

  // const stakingTokenData = useSelector((state: RootState) => state.stakingTokenData);

  // console.log(stakingTokenData);
  // const [txDispatched, setTxDispatched] = useState(false);

  // const {
  //   stakingTokenContract,
  //   stakeManager,
  //   stakeValue
  // } = stakingTokenData;

  // const approveTx = async () => {
  //   const currentAllowance = await stakingTokenContract.allowance(account, stakeManager.address)
  //   if (currentAllowance.lt(stakeValue)) {
  //     const approveTx = await stakingTokenContract.approve(stakeManager.address, stakeValue, {
  //       from: account
  //     })
  //     await approveTx.wait(2);
  //   }
  // }

  if (isSuccess) return <div>Succesfully increased allowance</div>
  return (<Button onClick={() => approve()}>Approve (value) WETH for spend</Button>)
}
