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
      mt='60px'
    >
      {connectors.map((connector) => (
        <Button.CTA
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          text={`Connect with ${connector.name} ${!connector.ready ? ' (unsupported)' : ''} ${
            connector.id === pendingConnector?.id ? ' (connecting)' : ''
          }`}
        />
      ))}
      {error != null && (
        <Alert severity='error'>
          <Typography variant='h6' fontWeight={600}>
            {error.message}
          </Typography>
        </Alert>
      )}
    </Box>
  )
}
