/* eslint-disable multiline-ternary */
import { ethers } from 'ethers'
import { useFormik } from 'formik'
import { FC, useContext, useState } from 'react'
import InsertERC20TokenAddress from './InsertERC20TokenAddress'
import { Button, Box, Paper, Typography, ButtonType, Icon } from '../../../../../../components/atoms'
import SuggestedTokenFromServer from './SuggestedTokenFromServer'
import { isLocalHost } from '../../../../../../utils'
import { TokenContext } from '../TokenContextWrapper'
import { jumpToStep } from '../../registerRelaySlice'
import { RegisterSteps } from '../../RegisterFlowSteps'
import { useAppDispatch } from '../../../../../../hooks'

interface IProps {
  success: boolean
}

const TokenSelection: FC<IProps> = ({ success }) => {
  const { chain, chainId, handleFindFirstTokenButton, setToken } = useContext(TokenContext)
  const dispatch = useAppDispatch()
  const [radioValue, setRadioValue] = useState(0)
  const getTokenAddress = useFormik({
    initialValues: {
      token: ''
    },
    onSubmit: async (values) => {
      console.log('values', values)
      if (radioValue === 2) {
        const token = await handleFindFirstTokenButton()
        setToken(token)
      } else {
        setToken(values.token)
      }
      dispatch(jumpToStep(RegisterSteps['Mint Selection']))
    }
  })

  const handleChangeToken = (address: string) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getTokenAddress.setFieldValue('token', address)
  }

  const isAddress = ethers.utils.isAddress(getTokenAddress.values.token)

  const elements = [
    {
      label: 'Suggested Tokens from server',
      children: (
        <SuggestedTokenFromServer chainId={chainId} handleChangeToken={handleChangeToken} chain={chain} getTokenAddress={getTokenAddress} />
      ),
      disabled: radioValue !== 0,
      show: chain.stakingTokens?.length !== undefined && chain.stakingTokens?.length > 0
    },
    {
      label: 'Insert ERC20 token address',
      children: <InsertERC20TokenAddress handleChangeToken={handleChangeToken} />,
      disabled: radioValue !== 1,
      show: true
    },
    {
      label: 'Fetch first available token',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      children: <></>,
      disabled: radioValue !== 2,
      show: true
    }
  ]

  const suggestedTokens = elements[0]

  if (success) {
    return (
      <Box>
        <Icon.Token /> &nbsp;
        <Typography>Token name</Typography>
      </Box>
    )
  }

  return (
    <Box component='form' onSubmit={getTokenAddress.handleSubmit}>
      {isLocalHost ? (
        <Box>
          {elements.map((element, index) => {
            if (element.show) {
              return (
                <Paper elevation={radioValue === index ? 5 : 2} key={index}>
                  <Box my={4} p={4}>
                    <Box display='flex'>
                      <Box>
                        <Button.Radio
                          checked={radioValue === index}
                          onChange={() => {
                            setRadioValue(index)
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography>{element.label}</Typography>
                        {element.children}
                        <Box mt={2} width='200px'>
                          <Button.Contained disabled={element.disabled} size='large' type={ButtonType.SUBMIT}>
                            Fetch Token
                          </Button.Contained>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )
            }
            return <></>
          })}
        </Box>
      ) : (
        <Box>
          <Box>
            <Typography>{suggestedTokens.label}</Typography>
            {suggestedTokens.children}
          </Box>
          <Box>
            <Button.Contained type={ButtonType.SUBMIT}>Fetch Token</Button.Contained>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default TokenSelection

// const SwitchTokenButton = () => {
//   const handleSwitchToken = () => setToken(null)

//   return (
//     <Box width='200px'>
//       <Button.Contained onClick={handleSwitchToken}>Switch Token</Button.Contained>
//     </Box>
//   )
// }
