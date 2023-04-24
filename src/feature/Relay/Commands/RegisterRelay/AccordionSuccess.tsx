import { FC, ReactNode } from 'react'
import { AccordionBase, AccordionSummaryBase } from '../../../../components/atoms/Accordion'
import { Box, Icon, Typography } from '../../../../components/atoms'
import { colors } from '../../../../theme'
import { RegisterSteps } from './RegisterFlowSteps'

const sx = {
  root: {
    backgroundColor: colors.lightGreen
  }
}

interface IAccordionSuccessProps {
  children?: ReactNode
  title?: string

  step: RegisterSteps
}

const AccordionSuccess: FC<IAccordionSuccessProps> = ({ children, title, step }) => {
  return (
    <AccordionBase expanded={false} sx={sx.root}>
      <AccordionSummaryBase
        sx={{
          cursor: 'unset !important'
        }}
      >
        <Box display='flex' gap='10px' width='100%' alignItems='center'>
          <Icon.Success />
          <Typography variant={'body1'} color={'success.main'} fontWeight={600}>
            Step {step + 1}:
          </Typography>
          <Typography variant={'body1'} color={'success.main'} fontWeight={500}>
            {title}
          </Typography>
          {children}
        </Box>
      </AccordionSummaryBase>
    </AccordionBase>
  )
}

export default AccordionSuccess
