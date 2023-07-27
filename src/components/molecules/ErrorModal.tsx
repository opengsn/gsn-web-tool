import React, { FC, useState } from 'react'
import Modal from '../atoms/Modal'
import { Box, Button, Icon, Typography } from '../atoms'

const ErrorModal: FC = () => {
  const [open, setOpen] = useState<boolean>(true)
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
      }}
    >
      <Box bgcolor='primary.cardBG' border='1px solid' borderColor='primary.cardOutline' p={15}>
        <Box mb={4}>
          <Icon.Info width='40px' height='40px' fill='black' />
        </Box>
        <Box>
          <Typography variant={'h1'}>Request failed</Typography>
        </Box>
        <Box textAlign='start' mx='auto' mt={4}>
          <Typography variant='h4'>Please make sure that your machine is connected to the electricity</Typography>
        </Box>
        <Box width='200px' mx='auto' mt={10}>
          <Button.CTA text='OK' onClick={() => setOpen(false)} />
        </Box>
      </Box>
    </Modal>
  )
}

export default ErrorModal
