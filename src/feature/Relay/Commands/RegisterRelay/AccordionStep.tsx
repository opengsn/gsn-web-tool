import { FC, ReactNode } from 'react'
import Accordion, { AccordionDetails, AccordionSummary } from '../../../../components/atoms/Accordion'
import { Box, Typography, VariantType } from '../../../../components/atoms'
import { RegisterSteps } from './RegisterFlowSteps'

interface IAccordionStep {
  children: ReactNode
  title: string
  step: RegisterSteps
  expanded: boolean
}

const AccordionStep: FC<IAccordionStep> = ({ children, title, step, expanded }) => {
  return (
    <Accordion expanded={expanded}>
      <AccordionSummary>
        <Box display='flex' gap='10px' width='100%' alignItems='center'>
          <Typography variant={VariantType.H5} fontWeight={600}>
            Step {step + 1}:
          </Typography>
          <Typography variant={VariantType.H5} fontWeight={500}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}

export default AccordionStep
