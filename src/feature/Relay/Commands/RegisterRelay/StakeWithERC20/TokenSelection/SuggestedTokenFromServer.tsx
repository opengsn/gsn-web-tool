import React, { FC } from 'react'
import { Button, Icon, Typography, VariantType, Box, ButtonType } from '../../../../../../components/atoms'
import { colors } from '../../../../../../theme'
import TokenSelectOption from '../TokenSelectOption'
import { ChainWithGsn } from '../../../../../../types'

interface IProps {
  chainId: number
  chain: ChainWithGsn
  getTokenAddress: any
  handleChangeToken: (token: string) => void
}

const SuggestedTokenFromServer: FC<IProps> = ({ chainId, chain, getTokenAddress, handleChangeToken }) => {
  return (
    <Box>
      <Typography>Suggested Tokens from server</Typography> &nbsp;
      <Button.Icon onClick={() => {}}>
        <Icon.Info fill={colors.black} width='16px' height='16px' />
      </Button.Icon>
      <Box>
        <Typography variant={VariantType.XSMALL}>Select token from list:</Typography>
      </Box>
      {chain.stakingTokens?.map((stakingToken) => {
        return (
          <TokenSelectOption
            key={stakingToken}
            address={stakingToken}
            chainId={chainId}
            handleChangeToken={handleChangeToken}
            checked={getTokenAddress.values.token === stakingToken}
          />
        )
      })}
      <Box width='180px' height='60px' mt='20px'>
        <Button.Contained type={ButtonType.SUBMIT}>
          <Typography variant={VariantType.H6}>Fetch token</Typography>
        </Button.Contained>
      </Box>
    </Box>
  )
}

export default SuggestedTokenFromServer
