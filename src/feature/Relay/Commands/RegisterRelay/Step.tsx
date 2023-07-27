import { FC, ReactNode } from 'react'
import { Box, Card, Typography } from '../../../../components/atoms'
import { RegisterSteps } from './RegisterFlowSteps'
import { useTheme } from '@mui/material'

interface IStep {
  children: ReactNode
  title: string
  step: RegisterSteps
  expanded: boolean
  success: boolean
}

const Step: FC<IStep> = ({ children, title, step, expanded, success }) => {
  const theme = useTheme()
  return (
    <Card>
      <Box
        display='flex'
        flexDirection={expanded ? 'column' : 'row'}
        alignItems={expanded ? 'start' : 'center'}
        p={15}
        bgcolor={'primary.cardBG'}
      >
        <Box mr={2}>
          <Box display='flex' gap='10px' width='100%' alignItems='center'>
            <Typography variant={'h4'} fontWeight={600} color={theme.palette.primary.white}>
              Step {step + 1}:
            </Typography>
            <Typography variant={'h4'} fontWeight={300} color={theme.palette.primary.mainBrightWhite}>
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
