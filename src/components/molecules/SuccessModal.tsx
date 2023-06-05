import React, { FC, useEffect, useState } from 'react'
import { Typography, Box, Button, Icon } from '../atoms'
import Modal from '../atoms/Modal'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useLocalStorage } from '../../hooks'
import { jumpToStep } from '../../feature/Relay/Commands/RegisterRelay/registerRelaySlice'

const SuccessModal: FC = () => {
  const [, setToken] = useLocalStorage('token', '')
  const [, setHashes] = useLocalStorage('hashes', {})
  const [, setLocalMintAmount] = useLocalStorage('localMintAmount', '')
  const [, setFunds] = useLocalStorage<string>('funds', '0.5')
  const [open, setOpen] = useState<boolean>(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setToken('')
    setHashes({})
    setLocalMintAmount('')
    setFunds('0.5')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = useNavigate()
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
        dispatch(jumpToStep(-1))
      }}
    >
      <Box mb={4}>
        <Icon.Success width='40px' height='40px' />
      </Box>
      <Box mb={8}>
        <Typography variant={'h5'}>Relay was set successfully</Typography>
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
          <Button.Contained
            onClick={() => {
              setOpen(false)
            }}
          >
            Close
          </Button.Contained>
        </Box>
      </Box>
    </Modal>
  )
}

export default SuccessModal
