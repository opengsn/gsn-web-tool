import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Alert, Box, Button, Typography } from '../../../components/atoms'

interface chainIdHandlerProps {
  relayChainId: number
}

export default function ChainIdHandler({ relayChainId }: chainIdHandlerProps) {
  const { chain } = useNetwork()
  const { error, isLoading, switchNetwork } = useSwitchNetwork({ chainId: relayChainId })

  return (
    <Alert severity='error'>
      <Box mb='10px'>
        <Typography variant='body2'>
          Wrong chain : Wallet is connected to ID #{chain?.id} while the relay is on #{relayChainId}
        </Typography>
      </Box>
      {error !== null
        ? (
        <Box mb='10px'>
          <Typography variant='body2'>Chain ID check failed: {error?.message}</Typography>
        </Box>
          )
        : null}
      <Box width='200px'>
        <Box>
          <Button.Contained disabled={isLoading} onClick={() => switchNetwork?.(relayChainId)}>
            Switch network
          </Button.Contained>
        </Box>
        {isLoading && (
          <Alert severity='info' icon={false}>
            <Typography variant='body1'>
              Please approve the action in your wallet and wait for action processing by the blockchain
            </Typography>
          </Alert>
        )}
      </Box>
    </Alert>
  )
}
