import {useEffect, useState} from "react";

import {Address} from "@opengsn/common/dist/types/Aliases";
import {Form, Collapse, Button} from "react-bootstrap";
import {useFormik} from "formik";
import {ethers, BigNumber} from "ethers";

import FundRelay from "./RegisterRelay/FundRelay";
import StakeERC20 from "./RegisterRelay/StakeERC20";
import AuthorizeWithHub from "./RegisterRelay/AuthorizeWithHub";

export interface RegisterOptions {
  /** ms to sleep if waiting for RelayServer to set its owner */
  sleepMs: number
  /** number of times to sleep before timeout */
  sleepCount: number
  from: Address
  token?: Address
  gasPrice?: string | BigNumber
  stake: string
  wrap: boolean
  funds: string | BigNumber
  relayUrl: string
  unstakeDelay: string
}

interface RegistrationResult {
  success: boolean
  transactions?: string[]
  error?: string
}


export default function RelayCommands({relay, account, provider}: any) {

  const signer = provider.getSigner();

  /* 
  const isRelayReady = async (relayUrl: string): Promise<boolean> => {
    const response: any = await fetch(relayUrl)
    return response.ready
  }
  const waitForRelay = async (relayUrl: string, timeout = 60): Promise<void> => {
    console.error(`Will wait up to ${timeout}s for the relay to be ready`)

    const endTime = Date.now() + timeout * 1000
    while (Date.now() < endTime) {
      let isReady = false
      try {
        isReady = await isRelayReady(relayUrl)
      } catch (e: any) {
        console.log(e.message)
      }
      if (isReady) {
        return
      }
      await sleep(3000)
    }
    console.error(`Relay not ready after ${timeout}s`)
  }

  const findFirstToken = async (relayHubAddress: string): Promise<string> => {
    const relayHub = new ethers.Contract(relayHubAddress, relayHubAbi, provider);
    const fromBlock = (await relayHub.functions.getCreationBlock())[0]
    const toBlock = Math.min(toNumber(fromBlock) + 5000, await provider.getBlockNumber())

    const filters = relayHub.filters.StakingTokenDataChanged();
    const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock);
    if (tokens.length === 0) {
      throw new Error(`no registered staking tokens on relayhub ${relayHubAddress}`)
    }
    // @ts-ignore
    return tokens[0].args.token
  }

   */
  /*
    const stakeWithERC20 = async () => {
  
      const transactions: string[] = []
      let stakingToken = undefined
      if (stakingToken == null) {
        stakingToken = await findFirstToken(relayHubAddress)
      }
  
      const stakingTokenContract = new ethers.Contract(stakingToken, iErc20TokenAbi, signer)
  
      const tokenDecimals = await stakingTokenContract.decimals()
      const tokenSymbol = await stakingTokenContract.symbol()
  
      const stakeParam = BigNumber.from((toNumber("1.0") * Math.pow(10, tokenDecimals)).toString())
  
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
  
      if (BigNumber.from(bal).gt(ethers.utils.parseEther("1.0"))) {
        console.log('Relayer already funded')
      } else {
        console.log('Funding relayer')
        const signer = provider.getSigner();
        const fundTx = await signer.sendTransaction({
          from: account,
          to: relayAddress,
          value: ethers.utils.parseUnits("1.0", "ether").toHexString()
        })
        if (fundTx.hash == null) {
          return {
            success: false,
            error: `Fund transaction reverted: ${JSON.stringify(fundTx)}`
          }
        }
        transactions.push(fundTx.hash)
      }
  
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
  
      if (unstakeDelay.gte(BigNumber.from("15000")) &&
        stake.gte(stakeParam)
      ) {
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
  
        const stakeTx = await stakeManager
          .stakeForRelayManager(stakingToken, relayAddress, "15000".toString(), stakeValue, {
            from: account
          })
        // @ts-ignore
        transactions.push(stakeTx.transactionHash)
      }
    }

  //      await waitForRelay("http://localhost:8090/getaddr")

  console.log('return success');
  return {
    success: true
  }


}

    */
  const registerRelay = async (options: RegisterOptions): Promise<RegistrationResult> => {
    try {
      /*
       * form validation 
  
  
      if (!(isSameAddress(token, stakingToken) || isSameAddress(token, constants.ZERO_ADDRESS))) {
        console.log(`Cannot use token ${stakingToken}. Relayer already uses token: ${token}`)
        throw new Error(`Cannot use token ${stakingToken}. Relayer already uses token: ${token}`)
      }
  
      if (owner !== constants.ZERO_ADDRESS && !isSameAddress(owner, account)) {
        console.log(`Already owned by ${owner}, our account=${account}`)
        throw new Error(`Already owned by ${owner}, our account=${account}`)
      }
      try {
        await relayHub.verifyRelayManagerStaked(relayAddress)
        console.log('Relayer already authorized')
      } catch (e: any) {
        // hide expected error
        if (e.message.match(/not authorized/) == null) {
          console.log('verifyRelayManagerStaked reverted with:', e.message)
        }
        console.log('Authorizing relayer for hub')
        const authorizeTx = await stakeManager.authorizeHubByOwner(relayAddress, relayHubAddress, {from: account})
        // @ts-ignore
        //
        //        transactions.push(authorizeTx.transactionHash)
      }

        */
      //      await waitForRelay(options.relayUrl)
      console.log('return success');
      return {
        success: true
      }
    } catch (error: any) {
      console.log(error)
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        error: error.message
      }
    }
  }

  const DeregisterRelayButton = () => {
    const [showDeregisterRelayForm, setShowDeregisterRelayForm] = useState(false);
    return (
      <div className="row">
        <Button
          onClick={() => setShowDeregisterRelayForm(!showDeregisterRelayForm)}
          aria-controls="register-relay-form"
          aria-expanded={showDeregisterRelayForm}
          variant="danger"
          className="mt-2"
        >
          Deregister
        </Button>
        <Collapse in={showDeregisterRelayForm}>
          <div className="border p-3" id="register-relay-form">
            <div>WIP</div>
          </div>
        </Collapse>
      </div>
    )
  }

  const RegisterRelayButton = () => {
    const [showRegisterRelayForm, setShowRegisterRelayForm] = useState(false);
    const registerForm = useFormik({
      initialValues: {
        sleepMs: 1500,
        from: account,
        /** number of times to sleep before timeout */
        sleepCount: 100,
        token: undefined,
        stake: "1",
        wrap: false,
        funds: "1",
        relayUrl: "",
        unstakeDelay: 1000
      },
      onSubmit: values => {
        alert(JSON.stringify(values, null, 2));
        //  registerRelay(values);
      },
    });
    return (
      <div className="row">
        <Button
          onClick={() => setShowRegisterRelayForm(!showRegisterRelayForm)}
          aria-controls="register-relay-form"
          aria-expanded={showRegisterRelayForm}
          className="mt-2"
        >
          Register
        </Button>
        <Collapse in={showRegisterRelayForm}>
          <div className="border p-3" id="register-relay-form">

            <FundRelay relay={relay} signer={signer} account={account} />
            <StakeERC20 relay={relay} signer={signer} account={account} />
            <AuthorizeWithHub relay={relay} signer={signer} account={account} />
            { /*
            <h2>OLD - use buttons instead</h2>
            <Form
              onSubmit={registerForm.handleSubmit}>
              <Form.Group>
                <Form.Label>
                  token - optional
                  <Form.Control id="token" name="token" type="text" onChange={registerForm.handleChange} placeholder="token" />
                </Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  funds
                  <Form.Control id="funds" name="funds" type="text" onChange={registerForm.handleChange} />
                </Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  relayUrl
                  <Form.Control id="relayUrl" name="relayUrl" type="url" onChange={registerForm.handleChange} />
                </Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  unstakeDelay
                  <Form.Control id="unstakeDelay" name="unstakeDelay" type="text" onChange={registerForm.handleChange} />
                </Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Check id="wrap" name="wrap" >
                  <Form.Check.Input onChange={registerForm.handleChange} type="checkbox" />
                  <Form.Check.Label >wrap?</Form.Check.Label>
                </Form.Check>
              </Form.Group>
              <Button className="mt-2" variant="primary" type="submit">
                Stake and register
              </Button>
            </Form>
               */}
          </div>
        </Collapse>
      </div>
    )
  }

  return (
    <div>
      {relay.ready === false ?
        <RegisterRelayButton />
        : null}
      {relay.ready ?
        <DeregisterRelayButton />
        : null}
    </div>
  )
}
