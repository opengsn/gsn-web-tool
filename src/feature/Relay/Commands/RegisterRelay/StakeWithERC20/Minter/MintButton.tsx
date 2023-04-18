import { useContext } from 'react'
import { useContractWrite } from 'wagmi'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import Button from 'react-bootstrap/Button'

import ErrorButton from '../../../../components/ErrorButton'

import { useDefaultStateSwitchers } from '../../registerRelayHooks'
import { TokenContext } from '../TokenContextWrapper'
import { MinterContext } from './Minter'
import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'
import LoadingButton from '../../../../components/LoadingButton'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'

export default function MintButton() {
  const { token } = useContext(TokenContext)
  const { mintAmount } = useContext(MinterContext)
  const defaultStateSwitchers = useDefaultStateSwitchers()

  const {
    error: mintTokenError,
    isIdle,
    isError,
    isLoading,
    isSuccess,
    write: mintToken
  } = useContractWrite({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'deposit',
    overrides: { value: mintAmount },
    mode: 'recklesslyUnprepared',
    ...defaultStateSwitchers,
    onSuccess(data) {
      const text = 'Minting token'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    }
  })

  const createMintButton = () => {
    const text = <span>Mint {ethers.utils.formatEther(mintAmount)}</span>
    const MintSuccess = () => <div>Minted succesfully. Waiting for confirmations before proceeding...</div>
    const MintError = () => (
      <ErrorButton message={mintTokenError?.message} onClick={() => mintToken?.()}>
        <span>Retry {text}</span>
      </ErrorButton>
    )

    let content
    switch (true) {
      case isError:
        content = <MintError />
        break
      case isIdle:
        content = (
          <Button onClick={() => mintToken?.()} className='mt-2'>
            {text}
          </Button>
        )
        break
      case isLoading:
        content = <LoadingButton />
        break
      case isSuccess:
        content = <MintSuccess />
        break
    }

    if (content === undefined) return <span>unable to initialize mint button</span>
    return content
  }

  return createMintButton()
}
