import { useState, useContext } from 'react'
import { useContractWrite, useBalance } from 'wagmi'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { TokenContext } from './StakeWithERC20'
import LoadingButton from '../../../../components/LoadingButton'
import ErrorButton from '../../../../components/ErrorButton'

import iErc20TokenAbi from '@opengsn/common/dist/interfaces/IERC20Token.json'
import { useFormik } from 'formik'
import { ButtonGroup } from 'react-bootstrap'

export default function Mint () {
  const [mintAmount, setMintAmount] = useState(ethers.constants.Zero)
  const [outstandingMintAmount, setOutstandingMintAmount] = useState(ethers.constants.Zero)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: bal, isFetched: balIsFetched } = useBalance({
    addressOrName: account,
    token: token,
    staleTime: 32000,
    watch: true,
    enabled: false,
    onSuccess (data) {
      const outstandingTokenAmountCalculated = minimumStakeForToken.sub(data.value)
      if (mintAmount === ethers.constants.Zero) setMintAmount(outstandingTokenAmountCalculated)
      setOutstandingMintAmount(outstandingTokenAmountCalculated)
      console.log(Number(ethers.utils.formatEther(outstandingMintAmount)))
    }
  })
  // if (bal !== undefined && balIsFetched) {
  //   const outstandingTokenBalance = minimumStakeForToken.sub(bal.value)
  //   console.log(outstandingTokenBalance)
  // }

  const { error: mintTokenError, isIdle, isSuccess, isError, isLoading, write: mintToken } = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi
    },
    'deposit',
    {
      overrides: { value: mintAmount },
      onSuccess (data) {
        toast.info(ethers.utils.formatEther(mintAmount))
        toast.info(`Tokens minted with tx ${data.hash}`)
      }
    }
  )

  const MintAmountForm = () => {
    const getMintAmountForm = useFormik({
      initialValues: {
        amount: Number(ethers.utils.formatEther(outstandingMintAmount))
      },
      onSubmit: values => {
        console.log(typeof values.amount, values.amount, mintAmount)
        const amountBigNumber = ethers.utils.parseEther(values.amount.toString())
        setMintAmount(amountBigNumber)
      }
    })

    let valueIsValidAmount = false
    try {
      ethers.utils.parseEther(getMintAmountForm.values.amount.toString())
      valueIsValidAmount = true
    } catch (e: any) {
      console.log(e)
      // suppress error
    }

    return (
      <Form onSubmit={getMintAmountForm.handleSubmit}>
        <Form.Label>
          Enter the amount you wish to mint:
          <Form.Control
            id="amount"
            name="amount"
            type="number"
            lang="en"
            min="0.1"
            onChange={getMintAmountForm.handleChange}
            value={getMintAmountForm.values.amount}
          />
        </Form.Label>
        <br />
        <ButtonGroup>
          <Button disabled={!valueIsValidAmount} variant="success" type="submit">Change mint amount</Button>
          <Button onClick={e => getMintAmountForm.resetForm()}>Reset</Button>
        </ButtonGroup>
      </Form>
    )
  }

  const MintButton = () => {
    const MintError = () => {
      const text = `Mint outstanding amount: ${ethers.utils.formatEther(mintAmount)}`
      return (
        <ErrorButton message={mintTokenError?.message} onClick={() => mintToken()}>
          <span>Retry {text}</span>
        </ErrorButton>
      )
    }
    const text = <span>Mint {ethers.utils.formatEther(mintAmount)} {bal?.symbol}</span>
    return (
      <Card>
        <MintAmountForm />
        {isError
          ? <MintError />
          : <Button onClick={() => mintToken()} className="my-2">{text}</Button>
        }
      </Card>
    )
  }

  if (isLoading) return <LoadingButton />
  if (isSuccess) return <div>Waiting for confirmations...</div>
  return <MintButton />
}
