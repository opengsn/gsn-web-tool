import React, { ReactElement } from 'react'
import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'

type Placement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top'

interface IProps extends TooltipProps {
  children: ReactElement
  title: ReactElement | string
  placement?: Placement
}

const Tooltip = styled(({ className, title, children, placement = 'top' }: IProps) => (
  <MuiTooltip title={title} classes={{ popper: className }} placement={placement}>
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
