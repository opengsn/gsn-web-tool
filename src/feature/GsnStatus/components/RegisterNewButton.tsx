import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Icon, Box } from '../../../components/atoms'
import { ROUTES } from '../../../constants/routes'

const RegisterNewButton = () => {
  const navigate = useNavigate()
  return (
    <Button.Contained size='large' onClick={() => navigate(ROUTES.RegisterNew)}>
      <Box height='80px' display='flex' alignItems='center'>
        <Icon.PlusCircleFill />
        &nbsp; &nbsp;<Typography variant={'body1'}>Register New Relay</Typography>
      </Box>
    </Button.Contained>
  )
}

export default React.memo(RegisterNewButton)
