import React, { FC } from 'react'
import { Typography, Box, Button, Icon, VariantType } from '../atoms'
import Modal from '../atoms/Modal'
import { useNavigate } from 'react-router-dom'

const SuccessModal: FC = () => {
  const navigate = useNavigate()
  return (
    <Modal open={true}>
      <Box mb={4}>
        <Icon.Success width='40px' height='40px' />
      </Box>
      <Box mb={8}>
        <Typography variant={VariantType.H3}>Relay was set successfully</Typography>
      </Box>
      <Box display='flex' gap={4} justifyContent='center'>
        <Box width='200px'>
          <Button.Contained
            color='success'
            onClick={() => {
              navigate('/')
            }}
          >
            Back to GSN page
          </Button.Contained>
        </Box>
        <Box width='200px'>
          <Button.Contained>Close</Button.Contained>
        </Box>
      </Box>
    </Modal>
  )
}

export default SuccessModal
