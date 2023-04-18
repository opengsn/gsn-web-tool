import React, { FC, Fragment, useState } from 'react'
import AccordionStep from './AccordionStep'
import AccordionSuccess from './AccordionSuccess'
import Funder from './FundRelay/Funder'
import TokenSelection from './StakeWithERC20/TokenSelection/TokenSelection'
import TokenContextWrapper from './StakeWithERC20/TokenContextWrapper'
import Minter from './StakeWithERC20/Minter/Minter'

export enum RegisterSteps {
  'Funding relay',
  'Token selection',
  'Mint Selection',
  'Authorizing Hub',
  'Waiting for Relay to be Ready'
}

interface IProps {
  currentStep: RegisterSteps
}

const RegisterFlowSteps: FC<IProps> = ({ currentStep }) => {
  const [expanded, setExpanded] = useState<RegisterSteps | null>(null)

  const steps = [
    {
      title: 'Funding relay',
      children: <Funder success={currentStep > RegisterSteps['Funding relay']} />,
      step: RegisterSteps['Funding relay']
    },
    {
      title: 'Token selection',
      children: <TokenSelection success={currentStep > RegisterSteps['Token selection']} />,
      step: RegisterSteps['Token selection']
    },
    {
      title: 'Mint Selection',
      children: <Minter />,
      step: RegisterSteps['Mint Selection']
    }
  ]

  const onChange = (step: RegisterSteps | null) => {
    setExpanded(step)
  }

  return (
    <TokenContextWrapper>
      {steps.map((step, index) => (
        <Fragment key={index}>
          {currentStep <= step.step
            ? (
            <AccordionStep {...step} expanded={currentStep === step.step} onChange={onChange}>
              {step.children}
            </AccordionStep>
              )
            : (
            <AccordionSuccess {...step}>{step.children}</AccordionSuccess>
              )}
        </Fragment>
      ))}
    </TokenContextWrapper>
  )
}

export default RegisterFlowSteps
