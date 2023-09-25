import { Accordion, AccordionDetails, AccordionSummary, Box } from '../../../components/atoms'

import NetworkHeader from './NetworkHeader'
import RelayHubInfo from './RelayHubInfo'
import RelaysTable from './RelaysTable/RelaysTable'

import { INetwork } from '../networkListSlice'
import { Theme, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

interface NetworkCardProps {
  network: INetwork
  selectedGroup?: string
}

const glowStyle = (theme: Theme, glowing: boolean) => ({
  animation: glowing ? 'glow 1s infinite alternate' : 'none',
  borderRadius: theme.borderRadius.small,
  '@keyframes glow': {
    '0%': {
      boxShadow: `0 0 0 0 ${theme.palette.primary.mainCTA}`
    },
    '100%': {
      boxShadow: `0 0 0 1px ${theme.palette.primary.mainCTA}`
    }
  }
})

export default function NetworkCard({ network, selectedGroup }: NetworkCardProps) {
  const { relays, chain } = network
  const { relayHubAddress, RelayHubAbi } = chain.gsn
  const theme = useTheme()
  const [glowing, setGlowing] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)

  useEffect(() => {
    if (selectedGroup === chain.gsn.group) {
      setGlowing(true)
      setTimeout(() => {
        setGlowing(false)
      }, 4000)
    }
  }, [selectedGroup, chain.gsn.group])

  return (
    <Box pt='20px' className={chain.gsn.group}>
      <Box sx={glowStyle(theme, glowing)}>
        <Accordion
          expanded={expanded}
          onChange={(event) => {
            setExpanded((prev) => !prev)
          }}
        >
          <AccordionSummary>
            <Box p={15}>
              <NetworkHeader group={chain.gsn.group} name={chain.name} />
              <RelayHubInfo
                blockExplorerUrl={chain.blockExplorers?.default.url}
                relayHubAddress={relayHubAddress}
                RelayHubAbi={RelayHubAbi}
                chainId={chain.id}
                activeRelays={network.activeRelays}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box p='0 15px 15px 15px'>
              <RelaysTable relays={relays} chain={chain} />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}
