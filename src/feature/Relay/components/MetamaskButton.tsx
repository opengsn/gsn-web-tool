import { useConnect } from 'wagmi'
import { Box, Button, Typography } from '../../../components/atoms'

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
      height='70px'
    >
      {connectors.map((connector) => (
        <Button.Contained disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}>
          <Typography variant={'body2'}>Connect with {connector.name}
          {!connector.ready && ' (unsupported)'}
          {connector.id === pendingConnector?.id && ' (connecting)'}
          </Typography>
        </Button.Contained>
      ))}
      {error != null && <div>{error.message}</div>}
    </Box>
  )
}
