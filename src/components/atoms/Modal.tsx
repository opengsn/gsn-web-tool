import { Modal as MuiModal } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Box } from '../atoms'

interface IProps {
  children: ReactNode
  open: boolean
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  height: '50%',
  overflow: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: 0,
  boxShadow: 24,
  p: 4
}

const Modal: FC<IProps> = ({ children, open }) => {
  return (
    <MuiModal open={open}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  )
}

export default Modal
