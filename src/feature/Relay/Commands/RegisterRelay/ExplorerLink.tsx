import React, { FC, useContext } from 'react'
import { Box, Icon } from '../../../../components/atoms'
import { TokenContext } from './StakeWithERC20/TokenContextWrapper'
import { useTheme } from '@mui/material'
import { addSlashToUrl } from '../../../../utils'

interface IProps {
  params?: string | null
  explorerLink?: string | null
}

const ExplorerLink: FC<IProps> = ({ params, explorerLink }) => {
  const { explorerLink: explorerLinkContext } = useContext(TokenContext)
  const theme = useTheme()
  const explorerLinkToUse = addSlashToUrl(explorerLink) ?? addSlashToUrl(explorerLinkContext)

  if (!explorerLinkToUse || !params) return null

  return (
    <Box
      component={'a'}
      href={`${explorerLinkToUse}${params}`}
      target='_blank'
      sx={{
        verticalAlign: 'middle'
      }}
    >
      &nbsp;
      <Icon.Redirect fill={theme.palette.primary.white} />
    </Box>
  )
}

export default ExplorerLink
