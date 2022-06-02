import {useState, useEffect} from "react";
import {ethers, BigNumber} from "ethers";

import Button from "react-bootstrap/Button";

import {toNumber} from "@opengsn/common";
import {isSameAddress, sleep} from "@opengsn/common/dist/Utils";
import {constants} from "@opengsn/common/dist/Constants";

import iErc20TokenAbi from "@opengsn/common/dist/interfaces/IERC20Token.json"

export default function StakeERC20({relay, signer, account}: any) {

  const {
    relayManagerAddress: relayAddress,
    ownerAddress: owner,
    relayHubAddress,
    relayHub,
    stake,
    unstakeDelay,
    stakeManager,
    bal
  } = relay;

//  const [balance, setBalance] = useState(0);

  const findFirstToken = async (relayHubAddress: string): Promise<string> => {
    //    const relayHub = new ethers.Contract(relayHubAddress, relayHubAbi, signer);
    const fromBlock = (await relayHub.functions.getCreationBlock())[0]
    const toBlock = Math.min(toNumber(fromBlock) + 5000, await signer.provider.getBlockNumber())

    const filters = relayHub.filters.StakingTokenDataChanged();
    console.log(relayHub.filters)

    const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock);
    console.log(tokens);
    if (tokens.length === 0) {
      throw new Error(`no registered staking tokens on relayhub ${relayHubAddress}`)
    }
    // @ts-ignore
    return tokens[0].args.token
  }


  const mintToken = async () => {
    console.log('test');
    let stakingToken = null;
    if (stakingToken == null) {
      stakingToken = await findFirstToken(relayHubAddress)
    }

    console.log(stakingToken);

    const stakingTokenContract = new ethers.Contract(stakingToken, iErc20TokenAbi, signer)
    const tokenDecimals = await stakingTokenContract.decimals()
    const tokenSymbol = await stakingTokenContract.symbol()

    const stakeParam = BigNumber.from((toNumber("1.0") * Math.pow(10, tokenDecimals)).toString())

    if (owner === constants.ZERO_ADDRESS) {
      let i = 0
      while (true) {
        console.debug(`Waiting ${1000}ms ${i}/${60} for relayer to set ${account} as owner`)
        await sleep(1000)
        const newStakeInfo = (await stakeManager.getStakeInfo(relayAddress))[0]
        if (newStakeInfo.owner !== constants.ZERO_ADDRESS && isSameAddress(newStakeInfo.owner, account)) {
          console.log('RelayServer successfully set its owner on the StakeManager')
          break
        }
        if (60 === i++) {
          throw new Error('RelayServer failed to set its owner on the StakeManager')
        }
      }
    }

    const stakeValue = stakeParam.sub(stake)

    const tokenBalance = await stakingTokenContract.balanceOf(account)
    //   if (tokenBalance.lt(stakeValue) && true) {
    if (true) {
      // default token is wrapped eth, so deposit eth to make then into tokens.
      console.log(`wrapping formattoken`)
      let depositTx: any
      try {
        depositTx = await stakingTokenContract.deposit({
          from: account,
          value: stakeValue
        }) as any
      } catch (e) {
        console.log(e)
        //        throw new Error('No deposit() method on default token. is it wrapped ETH?')
      }
      console.log(depositTx);
    }

  }

  const stakeWithERC20 = async () => {
    const transactions: string[] = []
    let stakingToken = undefined
    if (stakingToken == null) {
      stakingToken = await findFirstToken(relayHubAddress)
    }

    const stakingTokenContract = new ethers.Contract(stakingToken, iErc20TokenAbi, signer)
    const tokenDecimals = await stakingTokenContract.decimals()

    const tokenSymbol = await stakingTokenContract.symbol()

    const formatToken = (val: any): string => {
      let shiftedBalance: BigNumber;
      const balance = BigNumber.from(toNumber(val._hex))
      const _tokenDecimals = BigNumber.from(tokenDecimals.toString())
      if (_tokenDecimals.eq(18)) {
        shiftedBalance = BigNumber.from(val.toString());
      } else if (_tokenDecimals.lt(18)) {
        const shift = BigNumber.from(18).sub(BigNumber.from(_tokenDecimals))
        shiftedBalance = balance.mul(BigNumber.from(10).pow(shift))
      } else {
        const shift = tokenDecimals.sub(18)
        shiftedBalance = balance.div(BigNumber.from(10).pow(shift))
      }
      return `${ethers.utils.formatEther(shiftedBalance)} ${tokenSymbol}`
    }

    const stakeParam = BigNumber.from((toNumber("1.0") * Math.pow(10, tokenDecimals)).toString())

    if (unstakeDelay.gte(BigNumber.from("15000")) && stake.gte(stakeParam) === false) {
      console.log('Relayer already staked')
      const stakeValue = stakeParam.sub(stake)
      console.log(`Staking relayer ${formatToken(stakeValue)}`,
        stake.toString() === '0' ? '' : ` (already has ${formatToken(stake)})`)
    } else {
      const config = await relayHub.getConfiguration()
      const minimumStakeForToken = await relayHub.getMinimumStakePerToken(stakingToken)
      if (minimumStakeForToken.gt(BigNumber.from(stakeParam.toString()))) {
        throw new Error(`Given stake ${formatToken(stakeParam)} too low for the given hub ${formatToken(minimumStakeForToken)} and token ${stakingToken}`)
      }
      if (minimumStakeForToken.eq(BigNumber.from('0'))) {
        throw new Error(`Selected token (${stakingToken}) is not allowed in the current RelayHub`)
      }
      if (config.minimumUnstakeDelay.gt(BigNumber.from("15000"))) {
        throw new Error(`Given minimum unstake delay ${"15000".toString()} too low for the given hub ${config.minimumUnstakeDelay.toString()}`)
      }
      const stakeValue = stakeParam.sub(stake)
      console.log(`Staking relayer ${formatToken(stakeValue)}`,
        stake.toString() === '0' ? '' : ` (already has ${formatToken(stake)})`)

      const tokenBalance = await stakingTokenContract.balanceOf(account)
      if (tokenBalance.lt(stakeValue) && true) {
        // default token is wrapped eth, so deposit eth to make then into tokens.
        console.log(`Wrapping ${formatToken(stakeValue)}`)
        let depositTx: any
        try {
          depositTx = await stakingTokenContract.deposit({
            from: account,
            value: stakeValue
          }) as any
        } catch (e) {
          throw new Error('No deposit() method on default token. is it wrapped ETH?')
        }
        transactions.push(depositTx.transactionHash)
      }
      const currentAllowance = await stakingTokenContract.allowance(account, stakeManager.address)
      console.log('Current allowance', formatToken(currentAllowance))
      if (currentAllowance.lt(stakeValue)) {
        console.log(`Approving ${formatToken(stakeValue)} to StakeManager`)
        const approveTx = await stakingTokenContract.approve(stakeManager.address, stakeValue, {
          from: account
        })
        approveTx.wait(2);
        transactions.push(approveTx.transactionHash)
      }

      const stakeTx = await stakeManager.connect(signer)
        .stakeForRelayManager(stakingToken, relayAddress, "15000".toString(), stakeValue, {
          from: account
        })
      // @ts-ignore
      transactions.push(stakeTx.transactionHash)
    }

  }


  useEffect(() => {
    //    console.log(signer);
    // signer.provider.getBalance(relayAddress).then((res: any) => {setBalance(res.toString())});
  }, []);

  return (
    <>
      <h5>Staking Relay:</h5>
      <Button onClick={() => mintToken()} className="my-2">Mint ERC20 wETH</Button>
      {BigNumber.from(bal).gt(ethers.utils.parseEther("1.0")) ?
        <div>Already staked</div> :
        <div>
          <Button onClick={() => stakeWithERC20()} className="my-2">
            Approve and stake with WETH
          </Button>
        </div>
      }
      <hr />
    </>
  )
}
