/* eslint-disable curly */
import React, { FC, useState } from 'react'
import AccordionStep from '../../../../components/molecules/AccordionStep'
import AccordionSuccess from '../../../../components/molecules/AccordionSuccess'

export enum RegisterSteps {
  'Funding relay',
  'Select token and mint',
  'Staking with ERC20 token',
  'Authorizing Hub',
  'Waiting for Relay to be Ready'
}

const steps = [
  {
    title: 'Funding relay',
    description: 'Funding relay with 0.1 ETH',
    children: <div>test</div>,
    step: RegisterSteps['Funding relay']
  }
]

interface IProps {
  currentStep: RegisterSteps
}

const RegisterFlowSteps: FC<IProps> = ({ currentStep }) => {
  const [expanded, setExpanded] = useState<RegisterSteps | null>(RegisterSteps['Funding relay'])

  const onChange = (step: RegisterSteps | null) => {
    setExpanded(step)
  }

  return (
    <>
      {steps.map((step, index) => {
        if (currentStep <= index) {
          return <AccordionStep {...step} expanded={expanded === step.step} onChange={onChange} />
        } else return <AccordionSuccess {...step} />
      })}
    </>
  )
}

export default RegisterFlowSteps
