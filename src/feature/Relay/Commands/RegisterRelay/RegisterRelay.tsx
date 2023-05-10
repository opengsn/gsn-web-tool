/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { useAccount, useProvider } from 'wagmi'

import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { fetchRegisterStateData } from './registerRelaySlice'

import { toast } from 'react-toastify'
import { Box, Button, Icon, Typography } from '../../../../components/atoms'
import Collapse from '../../../../components/atoms/Collapse'
import RegisterFlowSteps from './RegisterFlowSteps'

export default function RegisterRelay() {
  const relayData = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const status = useAppSelector((state) => state.register.status)
  const dispatch = useAppDispatch()
  const provider = useProvider({ chainId: Number(relayData.chainId) })
  const { address } = useAccount()

  const [showRegisterRelay, setShowRegisterRelay] = useState(false)
  const handleShowRegisterRelay = () => {
    setShowRegisterRelay(!showRegisterRelay)
  }

  const CollapseButton = () => {
    return (
      <Box
        width={{
          xs: '95%',
          md: '300px'
        }}
        mx='auto'
        mt='25px'
      >
        <Button.Contained
          size='large'
          onClick={handleShowRegisterRelay}
          aria-controls='register-relay-form'
          aria-expanded={showRegisterRelay}
        >
          Register
        </Button.Contained>
      </Box>
    )
  }

  useEffect(() => {
    if (address !== undefined) {
      dispatch(fetchRegisterStateData({ provider, account: address })).catch((e) => {
        console.log(e.message)
        toast.error(
          <>
            <p>Error while fetching relay status</p>
            <p>See console for error message</p>
          </>
        )
      })
    }
  }, [address, dispatch, provider])

  return (
    <Box my='25px'>
      {!showRegisterRelay && (
        <>
          <Typography variant={'subtitle2'}>
            Please note before registration:
            <br />
            <Icon.Info /> You are connected to your cryptocurrency wallet.
            <br /> <Icon.Info /> Your wallet was reset to interact with new relay connection.
          </Typography>
          <CollapseButton />
        </>
      )}
      <Collapse in={!!showRegisterRelay}>
        <Box textAlign='center' mb='25px'>
          <Typography variant={'h4'} fontWeight={600}>
            Registration
          </Typography>
        </Box>
        <Box>{showRegisterRelay && <RegisterFlowSteps currentStep={currentStep} />}</Box>
      </Collapse>
    </Box>
  )
}
