import React, { FC, Fragment } from 'react'
import Funder from './FundRelay/Funder'
import TokenSelection from './StakeWithERC20/TokenSelection/TokenSelection'
import TokenContextWrapper from './StakeWithERC20/TokenContextWrapper'
import Minter from './StakeWithERC20/Minter/Minter'
import Approver from './StakeWithERC20/Approver/Approve'
import Staker from './StakeWithERC20/Staker'
import StakeAddedListener from './StakeWithERC20/StakeAddedListener'
import Authorizer from './AuthorizeHub/Authorizer'
import ErrorModal from '../../../../components/molecules/ErrorModal'
import Step from './Step'
import { Box } from '../../../../components/atoms'

export enum RegisterSteps {
  'Funding relay',
  'Token selection',
  'Mint Selection',
  'Approve allowance',
  'Stake token',
  'Authorizing',
  'Success',
  'Error'
}

interface IProps {
  currentStep: RegisterSteps
}

const RegisterFlowSteps: FC<IProps> = ({ currentStep }) => {
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
      children: <Minter success={currentStep > RegisterSteps['Mint Selection']} />,
      step: RegisterSteps['Mint Selection']
    },
    {
      title: 'Approve allowance',
      children: <Approver success={currentStep > RegisterSteps['Approve allowance']} />,
      step: RegisterSteps['Approve allowance']
    },
    {
      title: 'Stake token',
      children: (
        <>
          <Staker success={currentStep > RegisterSteps['Stake token']} />
          {currentStep === RegisterSteps['Stake token'] && <StakeAddedListener />}
        </>
      ),
      step: RegisterSteps['Stake token']
    }
  ]

  return (
    <TokenContextWrapper>
      {steps.map((step, index) => (
        <Box key={index} my={3}>
          <Step {...step} expanded={currentStep === step.step} success={currentStep > step.step}>
            {currentStep >= step.step && step.children}
          </Step>
        </Box>
      ))}
      {currentStep === 5 && <Authorizer />}
      {currentStep === 7 && <ErrorModal />}
    </TokenContextWrapper>
  )
}

export default RegisterFlowSteps
