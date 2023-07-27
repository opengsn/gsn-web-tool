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
      <Box mb={4}>
        <Icon.Info width='40px' height='40px' fill='black' />
      </Box>
      <Box>
        <Typography variant={'h6'}>Request failed</Typography>
      </Box>
      <Box width='600px' textAlign='start' mx='auto' mt={4}>
        1. Please make sure that your machine is connected to the electricity <br />
        2. Plug in the electricity or go grab a cup of coffee <br />
        3. If you read the instructions above - well done
      </Box>
      <Box width='200px' mx='auto' mt={4}>
        <Button.Contained>OK</Button.Contained>
      </Box>
    </Modal>
  )
}

export default ErrorModal
