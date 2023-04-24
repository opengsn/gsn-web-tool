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
  // const RegisterFlowSteps = () => {
  //   const steps = Object.keys({})
  //   const listElems = steps
  //     .filter((i) => isNaN(parseInt(i, 10)))
  //     .map((step, index) => {
  //       let variant = currentStep >= index ? 'success' : ''

  //       const isActionableStep = currentStep === index && currentStep !== 4
  //       if (isActionableStep) {
  //         if (currentStep === index && status !== 'error') {
  //           variant = 'primary'
  //         } else if (currentStep === index && status === 'error') {
  //           variant = 'danger'
  //         } else {
  //           variant = ''
  //         }
  //       } else if (index === 4 && status === 'idle') {
  //         variant = ''
  //       }

  //       const passedStep = !isActionableStep && variant === 'success'
  //       return (
  //         <ListGroup.Item action key={step} variant={variant} onClick={() => dispatch(jumpToStep(index))}>
  //           {step} {passedStep ? <Check color='green'></Check> : null}
  //         </ListGroup.Item>
  //       )
  //     })

  //   const showDivider = currentStep <= 3

  //   return (
  //     <>
  //       <ListGroup>{listElems}</ListGroup>
  //       {showDivider ? <hr /> : null}
  //     </>
  //   )
  // }

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
        <Box>
          <RegisterFlowSteps currentStep={currentStep} />
          {/* {currentStep === 0 ? <Funder /> : null}
          {currentStep === 1 || currentStep === 2 ? <StakeWithERC20 /> : null}
          {currentStep === 3 ? <Authorizer /> : null} */}
          {/* <Steps /> */}
        </Box>
      </Collapse>
    </Box>
  )
}
