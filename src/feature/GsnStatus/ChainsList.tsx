import NetworkCard from './Network/NetworkCard'
import NetworkLinksNew from './components/NetworkGroups'

import { useAppSelector } from '../../hooks'
import { Box, Divider, Grid } from '../../components/atoms'
import { useState } from 'react'

export default function ChainsList() {
  const networks = useAppSelector((state) => state.networkList.networks)
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  return (
    <>
      <Grid container px='80px'>
        <Grid item xs={12} md={3}>
          <NetworkLinksNew selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
        </Grid>
      </Grid>
      <Box mt={5}>
        <Divider />
      </Box>
      <Box width='1100px' mx='auto'>
        {Object.values(networks).map((x) => {
          return (
            <div key={x.chain.name}>
              {x.chain.gsn.relayHubAddress !== undefined && x.errorMsg === ''
                ? (
                <NetworkCard network={x} selectedGroup={selectedGroup} />
                  )
                : null}
            </div>
          )
        })}
      </Box>
    </>
  )
}
