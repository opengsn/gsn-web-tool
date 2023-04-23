import { useEffect, useContext, useRef, useState } from 'react'
import { ethers } from 'ethers'

import { MinterContext } from './Minter'
import { TokenContext } from '../TokenContextWrapper'
import { TextField } from '../../../../../../components/atoms'

export default function MintAmountForm() {
  const [localMintAmount, setLocalMintAmount] = useState(ethers.constants.Zero)
  const { minimumStakeForToken } = useContext(TokenContext)
  const { setMintAmount } = useContext(MinterContext)
  const inputValue = useRef<HTMLInputElement>(null)

  const handleSetMintAmount = () => {
    try {
      const value = inputValue?.current?.value
      if (value === undefined) return

      const amountBigNumber = ethers.utils.parseEther(value)
      setLocalMintAmount(amountBigNumber)
    } catch (e: any) {
      // suppress error
    }
  }

  useEffect(() => {
    if (localMintAmount !== ethers.constants.Zero) {
      setMintAmount(localMintAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localMintAmount])

  useEffect(() => {
    return () => {
      setMintAmount(minimumStakeForToken)
    }
  }, [minimumStakeForToken, setMintAmount])

  return <TextField name='amount' ref={inputValue} onChange={() => handleSetMintAmount()} />
}
