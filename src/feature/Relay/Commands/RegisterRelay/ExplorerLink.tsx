import React, { FC, useContext } from 'react'
import { Box, Icon } from '../../../../components/atoms'
import { TokenContext } from './StakeWithERC20/TokenContextWrapper'

interface IProps {
  params?: string | null
  explorerLink?: string | null
}

const ExplorerLink: FC<IProps> = ({ params, explorerLink }) => {
  const { explorerLink: explorerLinkContext } = useContext(TokenContext)
  const explorerLinkToUse = explorerLink ?? explorerLinkContext

  if (!explorerLinkToUse || !params) return null

  return (
    <Box
      component={'a'}
      href={`${explorerLinkToUse}/${params}`}
      target='_blank'
      sx={{
        verticalAlign: 'middle'
      }}
    >
      <Icon.Redirect width='14px' height='14px' />
    </Box>
  )
}

export default ExplorerLink
