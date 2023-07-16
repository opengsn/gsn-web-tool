import { useConnect } from 'wagmi'
import { Alert, Box, Button, Typography } from '../../../components/atoms'

export default function MetamaskButton() {
  const { connect, connectors, error, pendingConnector } = useConnect()

  return (
    <Box
      width={{
        xs: '95%',
        md: '300px'
      }}
      mx='auto'
      mt='25px'
      display='flex'
    >
      {connectors.map((connector) => (
        <Button.Contained disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })} size='large'>
          <Typography variant={'body2'}>
            Connect with {connector.name}
            {!connector.ready && ' (unsupported)'}
            {connector.id === pendingConnector?.id && ' (connecting)'}
          </Typography>
        </Button.Contained>
      ))}
      {error != null && <Alert severity='error'>{error.message}</Alert>}
    </Box>
  )
}
