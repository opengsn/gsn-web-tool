import { FC, ReactNode } from 'react'
import { AccordionBase, AccordionSummaryBase } from '../../../../components/atoms/Accordion'
import { Box, Button, Icon, Typography, VariantType } from '../../../../components/atoms'
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
  onEdit?: () => void
  onCopyHash?: () => void
  step: RegisterSteps
}

const AccordionSuccess: FC<IAccordionSuccessProps> = ({ children, onEdit, title, onCopyHash, step }) => {
  return (
    <AccordionBase expanded={false} sx={sx.root}>
      <AccordionSummaryBase
        sx={{
          cursor: 'unset !important'
        }}
      >
        <Box display='flex' gap='10px' width='100%' alignItems='center'>
          <Icon.Success />
          <Typography variant={VariantType.H5} color={colors.success} fontWeight={600}>
            Step {step + 1}:
          </Typography>
          <Typography variant={VariantType.H5} color={colors.success} fontWeight={500}>
            {title}
          </Typography>
          {children}
          <Box display='flex' ml='auto' alignItems='center'>
            {onEdit != null && (
              <Button.Icon onClick={onEdit}>
                <Icon.Edit />
              </Button.Icon>
            )}
            {onCopyHash != null && (
              <Button.Text onClick={onCopyHash}>
                <Typography variant={VariantType.H5} color={colors.success} fontWeight={600}>
                  Copy hash
                </Typography>
              </Button.Text>
            )}
          </Box>
        </Box>
      </AccordionSummaryBase>
    </AccordionBase>
  )
}

export default AccordionSuccess
