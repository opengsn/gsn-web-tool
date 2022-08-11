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
import TransactionSuccessToast from '../../../../../components/TransactionSuccessToast'
import LoadingButton from '../../../../../components/LoadingButton'

export default function MintButton () {
  const { token } = useContext(TokenContext)
  const { mintAmount } = useContext(MinterContext)
  const defaultStateSwitchers = useDefaultStateSwitchers()

  const { error: mintTokenError, isError, isLoading, isSuccess, write: mintToken } = useContractWrite({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'deposit',
    overrides: { value: mintAmount },
    mode: 'recklesslyUnprepared',
    ...defaultStateSwitchers,
    onSuccess (data) {
      const text = 'Minting token'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    }
  })

  const MintButton = () => {
    const MintSuccess = () => { return <div>Minted succesfully</div> }
    const MintError = () => {
      const text = `Mint outstanding amount: ${ethers.utils.formatEther(mintAmount)}`
      return (
        <ErrorButton message={mintTokenError?.message} onClick={() => mintToken?.()}>
          <span>Retry {text}</span>
        </ErrorButton>
      )
    }

    if (isLoading) return <LoadingButton />
    if (isSuccess) return <MintSuccess />

    const text = <span>Mint {ethers.utils.formatEther(mintAmount)}</span>
    return (
      <>
        {isError
          ? <MintError />
          : <Button onClick={() => mintToken?.()} className="mt-2">{text}</Button>
        }
      </>
    )
  }

  return <MintButton />
}
