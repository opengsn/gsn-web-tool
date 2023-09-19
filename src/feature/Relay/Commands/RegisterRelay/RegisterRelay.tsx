/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { useAccount, useProvider } from 'wagmi'

import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { fetchRegisterStateData } from './registerRelaySlice'

import { Alert, Box, Button, Typography } from '../../../../components/atoms'
import Collapse from '../../../../components/atoms/Collapse'
import RegisterFlowSteps from './RegisterFlowSteps'

export default function RegisterRelay({ isOwner }: { isOwner: boolean }) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const dispatch = useAppDispatch()
  const provider = useProvider({ chainId: Number(relayData.chainId) })
  const { address } = useAccount()

  const [showRegisterRelay, setShowRegisterRelay] = useState(false)
  const handleShowRegisterRelay = () => {
    setShowRegisterRelay(!showRegisterRelay)
  }

  const CollapseButton = () => {
    return (
      <Box>
        <Box
          width={{
            xs: '95%',
            md: '120px'
          }}
          mx='auto'
          mt='60px'
        >
          <Button.CTA
            onClick={handleShowRegisterRelay}
            aria-controls='register-relay-form'
            aria-expanded={showRegisterRelay}
            disabled={!isOwner}
            text='Register'
          />
        </Box>
        {!isOwner && (
          <Box
            mt={5}
            width={{
              xs: '95%',
              md: '300px'
            }}
            mx='auto'
          >
            <Alert severity='warning'>
              <Typography variant='h5'>Connected wallet address is not the configured Relay Server owner address</Typography>
            </Alert>
          </Box>
        )}
      </Box>
    )
  }

  useEffect(() => {
    if (address !== undefined) {
      dispatch(fetchRegisterStateData({ provider, account: address }))
    }
  }, [address, dispatch, provider])

  return (
    <Box my='60px'>
      {!showRegisterRelay && <CollapseButton />}
      <Collapse in={!!showRegisterRelay}>
        {/* <Box textAlign='center' mb='25px'>
          <Typography variant={'h2'}>Registration</Typography>
        </Box> */}
        <Box>{showRegisterRelay && <RegisterFlowSteps currentStep={currentStep} />}</Box>
      </Collapse>
    </Box>
  )
}
