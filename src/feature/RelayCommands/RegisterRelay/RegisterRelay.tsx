import { useEffect, useState } from 'react'
import { useAccount, useProvider } from 'wagmi'

import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { fetchRegisterStateData, RegisterSteps } from './registerRelaySlice'
import Authorizer from './AuthorizeHub/Authorizer'
import Funder from './FundRelay/Funder'
import StakeWithERC20 from './StakeWithERC20/StakeWithERC20'

import ListGroup from 'react-bootstrap/ListGroup'
import { toast } from 'react-toastify'

export default function RegisterRelay () {
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const status = useAppSelector((state) => state.register.status)
  const dispatch = useAppDispatch()
  const provider = useProvider()
  const { address } = useAccount()

  const [showRegisterRelay, setShowRegisterRelay] = useState(false)
  const handleShowRegisterRelay = () => {
    setShowRegisterRelay(!showRegisterRelay)
  }

  const CollapseButton = () => {
    return (
      <Button
        onClick={handleShowRegisterRelay}
        aria-controls="register-relay-form"
        aria-expanded={showRegisterRelay}
        className="mt-2"
      >
        Register
        <br />
      </Button>
    )
  }
  const RegisterFlowSteps = () => {
    const steps = Object.keys(RegisterSteps)
    const listElems = steps.filter(i => isNaN(parseInt(i, 10)))
      .map((step, index) => {
        let variant = (currentStep >= index) ? 'success' : ''

        const isActionableStep = currentStep === index && currentStep !== 4
        if (isActionableStep) {
          if (currentStep === index && status !== 'error') {
            variant = 'primary'
          } else if (currentStep === index && status === 'error') {
            variant = 'danger'
          } else {
            variant = ''
          }
        } else if (index === 4 && status === 'idle') {
          variant = ''
        }

        return (<ListGroup.Item
          key={step}
          variant={variant}
        >{step} {status}</ListGroup.Item>
        )
      })
    return <>{listElems}</>
  }

  useEffect(() => {
    if (address !== undefined) {
      dispatch(fetchRegisterStateData({ provider, account: address })).
        catch((e) => {
          console.log(e.message)
          toast.error(<>
            <p>Error while fetching relay status</p>
            <p>See console for error message</p>
          </>)
        })
    }
  }, [])

  return (
    <>
      <CollapseButton />
      {showRegisterRelay
        ? <Collapse in={showRegisterRelay}>
          <div className="border p-3" id="register-relay-form">
            <RegisterFlowSteps />
            {currentStep === 0
              ? <>
                <Funder />
              </>
              : null}
            {currentStep === 1 || currentStep === 2 ? <StakeWithERC20 /> : null}
            {currentStep === 3 ? <Authorizer /> : null}
          </div>
        </Collapse>
        : null}
    </>
  )
}
