import { FC, ReactNode } from 'react'
import Accordion, { AccordionDetails, AccordionSummary } from '../atoms/Accordion'
import { Box, Typography, VariantType } from '../atoms'
import { RegisterSteps } from '../../feature/Relay/Commands/RegisterRelay/RegisterFlowSteps'

interface IAccordionStep {
  children: ReactNode
  title: string
  step: RegisterSteps
  expanded: boolean
  onChange: (step: RegisterSteps | null) => void
}

const AccordionStep: FC<IAccordionStep> = ({ children, title, step, expanded, onChange }) => {
  return (
    <Accordion expanded={expanded} onChange={() => onChange(expanded ? null : step)}>
      <AccordionSummary>
        <Box display='flex' gap='10px' width='100%' alignItems='center'>
          <Typography variant={VariantType.H5} fontWeight={600}>
            Step - {step + 1}
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
