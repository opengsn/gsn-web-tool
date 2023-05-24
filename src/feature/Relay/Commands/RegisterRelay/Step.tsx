import { FC, ReactNode } from 'react'
import { Box, Card, Icon, Typography } from '../../../../components/atoms'
import { RegisterSteps } from './RegisterFlowSteps'
import { colors } from '../../../../theme'

interface IStep {
  children: ReactNode
  title: string
  step: RegisterSteps
  expanded: boolean
  success: boolean
}

const Step: FC<IStep> = ({ children, title, step, expanded, success }) => {
  const typographyColor = success ? 'success.main' : 'common.black'
  return (
    <Card>
      <Box
        display='flex'
        flexDirection={expanded ? 'column' : 'row'}
        alignItems={expanded ? 'start' : 'center'}
        p={4}
        bgcolor={success ? colors.lightGreen : 'common.white'}
      >
        <Box mr={2}>
          <Box display='flex' gap='10px' width='100%' alignItems='center'>
            {success && <Icon.Success />}
            <Typography variant={'body1'} fontWeight={600} color={typographyColor}>
              Step {step + 1}:
            </Typography>
            <Typography variant={'body1'} fontWeight={500} color={typographyColor}>
              {title}
            </Typography>
          </Box>
        </Box>
        {(expanded || success) && <>{children}</>}
      </Box>
    </Card>
  )
}

export default Step
