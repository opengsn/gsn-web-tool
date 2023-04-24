import { useNetwork, useSwitchNetwork } from 'wagmi'

import LoadingButton from './LoadingButton'
import { Alert, Box, Button } from '../../../components/atoms'

interface chainIdHandlerProps {
  relayChainId: number
}

export default function ChainIdHandler({ relayChainId }: chainIdHandlerProps) {
  const { chain } = useNetwork()
  const { error, isLoading, switchNetwork } = useSwitchNetwork({ chainId: relayChainId })

  return (
    <Alert severity='error'>
      Wrong chain
      <p>
        Wallet is connected to ID #{chain?.id} while the relay is on #{relayChainId}
      </p>
      {isLoading ? <LoadingButton /> : null}
      {error !== null ? <Alert severity='error'>Chain ID check failed: {error?.message}</Alert> : null}
      {switchNetwork !== undefined && !isLoading
        ? (
        <Box width='200px'>
          <Button.Contained onClick={() => switchNetwork(relayChainId)}>Switch network</Button.Contained>
        </Box>
          )
        : null}
    </Alert>
  )
}
