import { useRef, useEffect, useContext } from 'react'
import { useFormik } from 'formik'
import { ethers } from 'ethers'

import Form from 'react-bootstrap/Form'
import { ButtonGroup, Button } from 'react-bootstrap'

import { MinterContext } from './Minter'
import { TokenContext } from '../StakeWithERC20'

export default function MintAmountForm () {
  const { minimumStakeForToken } = useContext(TokenContext)
  const { outstandingMintAmount, mintAmount, setMintAmount } = useContext(MinterContext)

  let initialAmount = Number(ethers.utils.formatEther(mintAmount))
  if (outstandingMintAmount !== null) initialAmount = Number(ethers.utils.formatEther(mintAmount))

  const getMintAmountForm = useFormik({
    initialValues: {
      amount: initialAmount
    },
    onSubmit: values => {
      console.log(outstandingMintAmount)
      console.log(typeof values.amount, values.amount, mintAmount)
      const amountBigNumber = ethers.utils.parseEther(values.amount.toString())
      setMintAmount(amountBigNumber)
    }
  })

  useEffect(() => {
    return () => {
      setMintAmount(minimumStakeForToken)
    }
  }, [minimumStakeForToken, setMintAmount])

  let valueIsValidAmount = false
  try {
    ethers.utils.parseEther(getMintAmountForm.values.amount.toString())
    valueIsValidAmount = true
  } catch (e: any) {
    console.log(e)
    // suppress error
  }

  return (
    <Form onSubmit={getMintAmountForm.handleSubmit} className="my-2">
      <Form.Label>
        <Form.Control
          id="amount"
          name="amount"
          type="number"
          lang="en"
          min="0"
          step="any"
          onChange={getMintAmountForm.handleChange}
          value={getMintAmountForm.values.amount}
        />
      </Form.Label>
      <br />
      <ButtonGroup>
        <Button disabled={!valueIsValidAmount} variant="success" type="submit">Change mint amount</Button>
        <Button onClick={() => {
          getMintAmountForm.resetForm()
          setMintAmount(minimumStakeForToken)
        }}>Reset</Button>
      </ButtonGroup>
    </Form>
  )
}
