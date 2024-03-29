import { DialogContent, Dialog as MuiDialog } from '@mui/material'
import { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
  open: boolean
  onClose?: () => void
}

const Modal: FC<IProps> = ({ children, open, onClose }) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      sx={(theme) => ({
        textAlign: 'center',
        '& .MuiDialog-paper': {
          borderRadius: theme.borderRadius.medium
        }
      })}
    >
      <DialogContent
        sx={{
          p: 0
        }}
      >
        {children}
      </DialogContent>
    </MuiDialog>
  )
}

export default Modal
