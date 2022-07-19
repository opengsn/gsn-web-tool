import { useContext } from 'react'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'
import { useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import iErc20TokenAbi from '@opengsn/common/dist/interfaces/IERC20Token.json'
import Button from 'react-bootstrap/Button'

import ErrorButton from '../../../../../components/ErrorButton'

import { TokenContext } from '../StakeWithERC20'
import { MinterContext } from './Minter'

export default function MintButton () {
  const { token } = useContext(TokenContext)
  const { mintAmount } = useContext(MinterContext)

  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { error: mintTokenError, isSuccess, isError, isLoading, write: mintToken } = useContractWrite(
    {
      addressOrName: token,
      contractInterface: iErc20TokenAbi,
      functionName: 'deposit',
      overrides: { value: mintAmount },
      onSuccess (data) {
        toast.info(`Tokens minted with tx ${data.hash}`)
      },
      ...defaultStateSwitchers
    }
  )

  const MintButton = () => {
    const MintError = () => {
      const text = `Mint outstanding amount: ${ethers.utils.formatEther(mintAmount)}`
      return (
        <ErrorButton message={mintTokenError?.message} onClick={() => mintToken()}>
          <span>Retry {text}</span>
        </ErrorButton>
      )
    }
    const text = <span>Mint {ethers.utils.formatEther(mintAmount)}</span>
    return (
      <>
        {isError
          ? <MintError />
          : <Button onClick={() => mintToken()} className="my-2">{text}</Button>
        }
      </>
    )
  }

  return <MintButton />
}
