import {useEffect} from "react";

import {useContractWrite, useWaitForTransaction, useBalance, useAccount, useContract, useToken} from 'wagmi';

import {ethers, BigNumber} from "ethers";

import Button from "react-bootstrap/Button";

import {useAppSelector, useAppDispatch} from "../../../../hooks";

import iErc20TokenAbi from "@opengsn/common/dist/interfaces/IERC20Token.json"
import {toNumber} from "@opengsn/common";
import {Address} from "@opengsn/common/dist/types/Aliases";

interface MintProps {
  token: Address;
  account: Address;
}

export default function Mint({token, account}: MintProps) {

  // const { relayHub, relayHubAddress, stake } = relay;

  const {data: mintTokenData, isError, isLoading, write: mintToken} = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi,
    },
    'deposit',
    {overrides: {value: ethers.utils.parseEther("1.0")}}
  )
  const { data: waitForMintTxData, isSuccess} = useWaitForTransaction({
    hash: mintTokenData?.hash,
    onSuccess(data) {
      console.log(data)
    }
  })


  const {data: bal} = useBalance({addressOrName: account, token: token, staleTime: 32000, watch: true })

  const mintTokenx = async (stakingToken: Address | null = null) => {

    // const stakingTokenContract = new ethers.Contract(stakingToken, iErc20TokenAbi, signer)
    // const tokenDecimals = await stakingTokenContract.decimals()
    // const tokenSymbol = await stakingTokenContract.symbol()
    // const stakeParam = BigNumber.from((toNumber("1.0") * Math.pow(10, tokenDecimals)).toString())

    // if (owner === constants.ZERO_ADDRESS) {
    //   let i = 0
    //   while (true) {
    //     console.debug(`Waiting ${1000}ms ${i}/${60} for relayer to set ${account} as owner`)
    //     await sleep(1000)
    //     const newStakeInfo = (await stakeManager.getStakeInfo(relayAddress))[0]
    //     if (newStakeInfo.owner !== constants.ZERO_ADDRESS && isSameAddress(newStakeInfo.owner, account)) {
    //       console.log('RelayServer successfully set its owner on the StakeManager')
    //       break
    //     }
    //     if (60 === i++) {
    //       throw new Error('RelayServer failed to set its owner on the StakeManager')
    //     }
    //   }
    // }

    // const stakeValue = stakeParam.sub(stake)
    // const tokenBalance = await stakingTokenContract.balanceOf(account)

    // if (tokenBalance.lt(stakeValue) && true) {
    //   if (true) {
    //     // default token is wrapped eth, so deposit eth to make then into tokens.
    //     console.log(`wrapping formattoken`)
    //     let depositTx: any
    //     try {
    //       depositTx = await stakingTokenContract.deposit({
    //         from: account,
    //         value: stakeValue
    //       }) as any
    //     } catch (e) {
    //       console.log(e)
    //       //        throw new Error('No deposit() method on default token. is it wrapped ETH?')
    //     }
    //     console.log(depositTx);
    //   }
    // }
  }


  if (isLoading) return <div>Processing…</div>
  if (isError) return <div>Transaction error</div>
  if (isSuccess) return <div>Bal {bal?.formatted}</div>
  return (
    <div>
      <div>Bal {bal?.formatted}</div>
      <Button onClick={() => mintToken()} className="my-2">Mint ERC20 wETH</Button>
    </div>
  )
}
