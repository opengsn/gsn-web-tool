import React, { Fragment, useState } from 'react'
import AccordionStep from './AccordionStep'
import AccordionSuccess from './AccordionSuccess'
import Funder from './FundRelay/Funder'
import StakeWithERC20 from './StakeWithERC20/StakeWithERC20'

export enum RegisterSteps {
  'Funding relay',
  'Token selection',
  'Staking with ERC20 token',
  'Authorizing Hub',
  'Waiting for Relay to be Ready'
}

interface IProps {
  currentStep: RegisterSteps
}

const RegisterFlowSteps = ({ currentStep }: IProps) => {
  const [expanded, setExpanded] = useState<RegisterSteps | null>(null)

  const steps = [
    {
      title: 'Funding relay',
      children: <Funder success={currentStep > RegisterSteps['Funding relay']} />,
      step: RegisterSteps['Funding relay']
    },
    {
      title: 'Token selection',
      children: <StakeWithERC20 success={currentStep > RegisterSteps['Token selection']} />,
      step: RegisterSteps['Token selection']
    }
  ]

  const onChange = (step: RegisterSteps | null) => {
    setExpanded(step)
  }

  return steps.map((step, index) => (
    <Fragment key={index}>
      {currentStep <= index
        ? (
        <AccordionStep {...step} expanded={expanded === step.step} onChange={onChange}>
          {step.children}
        </AccordionStep>
          )
        : (
        <AccordionSuccess {...step}>{step.children}</AccordionSuccess>
          )}
    </Fragment>
  ))
}

export default RegisterFlowSteps
