import { styled } from '@mui/material/styles'
import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Icon } from '../atoms'

interface IAccordionProps {
  children: NonNullable<ReactNode>
  expanded?: boolean
}

export const AccordionBase = styled(MuiAccordion)<IAccordionProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.cardBG,
  border: `1px solid ${theme.palette.primary.cardOutline}`,
  borderRadius: `${theme.borderRadius.medium} !important`
}))

const Accordion: FC<IAccordionProps> = ({ children, expanded }) => {
  return <AccordionBase expanded={expanded}>{children}</AccordionBase>
}

interface IAccordionSummaryProps {
  children: ReactNode
  onChange?: (event: React.SyntheticEvent) => void
  isManage?: boolean
}

export const AccordionSummaryBase: any = styled(MuiAccordionSummary)<IAccordionSummaryProps>(({ theme, isManage }) => ({
  borderBottom: `1px solid ${'grey.600'}`,
  width: '100%',
  cursor: 'unset !important',
  userSelect: 'text',
  margin: 0,
  '& .MuiAccordionSummary-content': {
    margin: 0,
    overflowX: 'auto'
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: 0
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    position: 'absolute',
    right: 30,
    top: isManage && 27.25
  }
}))

export const AccordionSummary: FC<IAccordionSummaryProps> = ({ children, onChange, isManage }) => {
  return (
    <AccordionSummaryBase expandIcon={<Icon.Chevron onClick={onChange} cursor='pointer' />} isManage={isManage}>
      {children}
    </AccordionSummaryBase>
  )
}

interface IAccordionDetailsProps {
  children: ReactNode
}

const AccordionDetailsBase = styled(MuiAccordionDetails)<IAccordionDetailsProps>(({ theme }) => ({
  overflowX: 'auto'
}))

export const AccordionDetails: FC<IAccordionDetailsProps> = ({ children }) => {
  return <AccordionDetailsBase>{children}</AccordionDetailsBase>
}

export default Accordion
