import { FC, ReactNode } from 'react'
import { AccordionBase, AccordionSummaryBase } from '../atoms/Accordion'
import { Box, Button, Icon, Typography, VariantType } from '../atoms'
import { colors } from '../../theme'

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
}

const AccordionSuccess: FC<IAccordionSuccessProps> = ({ children, onEdit, title, onCopyHash }) => {
  return (
    <AccordionBase expanded={false} sx={sx.root}>
      <AccordionSummaryBase
        sx={{
          cursor: 'unset !important'
        }}
      >
        <Box display='flex' gap='10px' width='100%' alignItems='center'>
          <Icon.Success />
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
