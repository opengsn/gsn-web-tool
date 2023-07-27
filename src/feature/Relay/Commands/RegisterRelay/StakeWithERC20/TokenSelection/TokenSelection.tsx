/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from 'formik'
import { FC, useContext, useEffect, useState } from 'react'
import InsertERC20TokenAddress from './InsertERC20TokenAddress'
import { Button, Box, Typography, ButtonType, Icon, Divider } from '../../../../../../components/atoms'
import SuggestedTokenFromServer from './SuggestedTokenFromServer'
import { TokenContext } from '../TokenContextWrapper'
import { jumpToStep } from '../../registerRelaySlice'
import { RegisterSteps } from '../../RegisterFlowSteps'
import { useAppDispatch, useAppSelector } from '../../../../../../hooks'
import chains from '../../../../../../assets/chains.json'
import { useToken } from 'wagmi'
import { useTheme } from '@mui/material'
import BlockExplorerUrl from '../../../../../GsnStatus/components/BlockExplorerUrl'

interface IProps {
  success: boolean
}

const TokenSelection: FC<IProps> = ({ success }) => {
  const { chainId, handleFindFirstTokenButton, setToken, token, explorerLink } = useContext(TokenContext)
  const currentStep = useAppSelector((state) => state.register.step)
  const { data: tokenData, refetch } = useToken({ address: token as any, enabled: false })
  const dispatch = useAppDispatch()
  const theme = useTheme()

  useEffect(() => {
    if (token !== '' && currentStep === RegisterSteps['Token selection']) {
      setToken(token)
      dispatch(jumpToStep(RegisterSteps['Mint Selection']))
    }
  }, [token, currentStep])

  useEffect(() => {
    if (token !== '' && currentStep === RegisterSteps['Token selection']) {
      refetch().catch(console.error)
    }
  }, [token])

  const [radioValue, setRadioValue] = useState(0)
  const getTokenAddress = useFormik({
    initialValues: {
      token: ''
    },
    onSubmit: async (values) => {
      if (radioValue === 2) {
        const token = await handleFindFirstTokenButton()
        setToken(token)
      } else {
        setToken(values.token)
      }
      currentStep === 1 && token && dispatch(jumpToStep(RegisterSteps['Mint Selection']))
    }
  })

  const handleChangeToken = (address: string) => {
    getTokenAddress.setFieldValue('token', address)
  }

  const supportedTokens = chains.find((chain) => chain.id === chainId)?.tokens

  const elements =
    supportedTokens != null
      ? [
          {
            label: 'Suggested Tokens from server',
            children: (
              <SuggestedTokenFromServer
                chainId={chainId}
                handleChangeToken={handleChangeToken}
                supportedTokens={supportedTokens}
                getTokenAddress={getTokenAddress}
                explorerLink={explorerLink}
              />
            ),
            disabled: radioValue !== 0,
            key: 0
          }
        ]
      : [
          {
            label: 'Insert ERC20 token address',
            children: <InsertERC20TokenAddress handleChangeToken={handleChangeToken} />,
            disabled: radioValue !== 1,
            key: 1
          },
          {
            label: 'Fetch first available token',
            children: <></>,
            disabled: radioValue !== 2,
            key: 2
          }
        ]

  if (success) {
    return (
      <>
        {currentStep === 2 && (
          <Box ml='auto'>
            <Button.Icon
              onClick={() => {
                setToken('')
                dispatch(jumpToStep(RegisterSteps['Token selection']))
              }}
            >
              <Icon.Edit />
            </Button.Icon>
          </Box>
        )}
        <Box display='flex' gap={4} alignItems='center' width='100%' mt={4}>
          <Icon.Token /> {/* TODO: icon from the json */}
          <Typography variant='h6' color={theme.palette.primary.mainPos}>
            {tokenData?.name}
          </Typography>
          <Box>
            <BlockExplorerUrl
              address={tokenData?.address ?? ''}
              url={explorerLink && tokenData?.address ? `${explorerLink}/token/${tokenData?.address}` : undefined}
            />
          </Box>
        </Box>
      </>
    )
  }

  return (
    <Box component='form' onSubmit={getTokenAddress.handleSubmit}>
      <Box mt={10} mb={7}>
        <Divider />
      </Box>
      <Box>
        {elements.map((element) => {
          return (
            <Box
              key={element.key}
              sx={{
                all: 'unset',
                cursor: 'pointer'
              }}
              bgcolor='common.black'
              onClick={() => {
                setRadioValue(element.key)
              }}
            >
              <Box display='flex' my={4} p={4}>
                <Box mr={7}>
                  <Button.Radio checked={!element.disabled} onChange={() => {}} />
                </Box>
                <Box>
                  <Box mb={1} width='400px'>
                    <Typography variant='h4' color={!element.disabled ? theme.palette.primary.mainCTA : 'grey'}>
                      {element.label}
                    </Typography>
                  </Box>
                  {element.children}
                </Box>
              </Box>
            </Box>
          )
        })}
        <Box ml={7} mt={2} width='220px'>
          <Button.CTA text='Fetch Token' type={ButtonType.SUBMIT} />
        </Box>
      </Box>
    </Box>
  )
}

export default TokenSelection
