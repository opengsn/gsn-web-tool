import { Grid } from '@mui/material'

import NetworkCard from './Network/NetworkCard'
import NetworkLinksNew from './components/NetworkGroups'

import { useAppSelector } from '../../hooks'
import Header from './components/Header'
import RegisterNewButton from './components/RegisterNewButton'
import { Box } from '../../components/atoms'

export default function ChainsList() {
  const networks = useAppSelector((state) => state.networkList.networks)

  return (
    <>
      <Header />

      {/* mx-0 prevents horizontal scrollbar from appearing within container-fluid  */}
      <Grid container px='12px'>
        <Grid item xs={12} md={3}>
          <NetworkLinksNew />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box height='120px' width={{ xs: '100%', md: '290px' }} ml={{ md: 'auto' }}>
            <RegisterNewButton />
          </Box>
        </Grid>
      </Grid>

      {Object.values(networks).map((x) => {
        return (
          <div key={x.chain.name}>
            {x.chain.gsn.relayHubAddress !== undefined && x.errorMsg === '' ? <NetworkCard network={x} /> : null}
          </div>
        )
      })}
    </>
  )
}
