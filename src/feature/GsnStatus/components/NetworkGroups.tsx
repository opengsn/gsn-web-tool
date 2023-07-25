import { useAppSelector } from '../../../hooks'
import { INetwork } from '../networkListSlice'
import { Box, Icon, Typography, GroupChip } from '../../../components/atoms'
import { Dispatch, SetStateAction } from 'react'
import { useTheme } from '@mui/material'

interface NetGroup {
  [key: string]: INetwork[]
}

const icons = [
  { key: 'Ethereum', icon: <Icon.Ethereum /> },
  { key: 'Optimism', icon: <Icon.Optimism /> },
  { key: 'Arbitrum', icon: <Icon.Arbitrum /> },
  { key: 'Other', icon: <></> },
  { key: 'Avalanche', icon: <Icon.Avalanche /> },
  { key: 'Binance', icon: <Icon.Binance /> },
  { key: 'Polygon', icon: <Icon.Polygon /> }
]

interface NetworkLinksNewProps {
  setSelectedGroup: Dispatch<SetStateAction<string>>
  selectedGroup?: string
}

export default function NetworkLinksNew({ setSelectedGroup, selectedGroup }: NetworkLinksNewProps) {
  const theme = useTheme()
  const networks = useAppSelector((state) => state.networkList.networks)
  const networkArray = Object.values(networks)
  const netGroups = networkArray
    .map((n) => n.group)
    .reduce(
      (set: NetGroup, g: string) => ({
        ...set,
        [g]: networkArray.filter((net) => net.group === g && net.errorMsg === '')
      }),
      {}
    )

  return (
    <Box display='flex' gap={3}>
      {Object.keys(netGroups)
        .filter((g) => netGroups[g].length > 0)
        .map((group) => {
          const icon = icons.find((entry) => entry.key === group)?.icon
          return (
            <Box key={group}>
              <GroupChip
                icon={icon}
                label={
                  <Typography
                    variant='h5'
                    color={selectedGroup === group ? theme.palette.primary.mainCTA : theme.palette.primary.mainBrightWhite}
                  >
                    {group}
                  </Typography>
                }
                onClick={() => {
                  if (selectedGroup === group) {
                    setSelectedGroup('')
                    return
                  }

                  setSelectedGroup(group)
                  document?.getElementsByClassName?.(group)[0]?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }}
                active={selectedGroup === group}
              />
            </Box>
          )
        })}
    </Box>
  )
}
