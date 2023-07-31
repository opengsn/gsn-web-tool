import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Alert, Box, Button, Typography } from '../../../components/atoms'
import { waitingForApproveText } from '../../../components/molecules/RegistrationInputWithTitle'

interface chainIdHandlerProps {
  relayChainId: number
}

export default function ChainIdHandler({ relayChainId }: chainIdHandlerProps) {
  const { chain } = useNetwork()
  const { error, isLoading, switchNetwork } = useSwitchNetwork({ chainId: relayChainId })

  return (
    <Box>
      <Alert severity='error'>
        <Box>
          <Typography variant='h6' fontWeight={600}>
            Wrong chain : Wallet is connected to ID #{chain?.id} while the relay is on #{relayChainId} &nbsp;
          </Typography>
        </Box>
        {error !== null && (
          <Box my='10px'>
            <Typography variant='h6' fontWeight={600}>
              Chain ID check failed: {error?.message}
            </Typography>
          </Box>
        )}
      </Alert>
      <Box width='200px' mx='auto'>
        <Box>
          <Button.Contained disabled={isLoading} onClick={() => switchNetwork?.(relayChainId)}>
            {!isLoading ? <>Switch network</> : <>Processing...</>}
          </Button.Contained>
        </Box>
        {isLoading && (
          <Alert severity='info' icon={false}>
            <Typography variant='h6'>{waitingForApproveText} </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  )
}
