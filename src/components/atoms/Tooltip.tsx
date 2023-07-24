import React, { ReactElement } from 'react'
import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'

interface IProps extends TooltipProps {
  children: ReactElement
  title: ReactElement | string
}

const Tooltip = styled(({ className, title, children }: IProps) => (
  <MuiTooltip title={title} placement='bottom-end' classes={{ popper: className }}>
    {children}
  </MuiTooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.cardBG,
    marginTop: '0 !important',
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.palette.primary.cardOutline}`,
    maxWidth: '200px'
  }
}))

export default Tooltip
