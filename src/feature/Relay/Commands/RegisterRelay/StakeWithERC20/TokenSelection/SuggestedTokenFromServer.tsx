import React, { FC } from 'react'
import { Typography, Box } from '../../../../../../components/atoms'
import TokenSelectOption from '../TokenSelectOption'

interface IProps {
  chainId: number
  supportedTokens: any // TODO: type
  getTokenAddress: any
  handleChangeToken: (token: string) => void
  explorerLink: string | null
}

const SuggestedTokenFromServer: FC<IProps> = ({ chainId, supportedTokens, getTokenAddress, handleChangeToken, explorerLink }) => {
  return (
    <Box>
      <Box>
        <Typography variant='h5'>Select token from list:</Typography>
      </Box>
      {supportedTokens?.map((token: any) => {
        return (
          <TokenSelectOption
            key={token}
            address={token.address}
            chainId={chainId}
            handleChangeToken={handleChangeToken}
            checked={getTokenAddress.values.token === token.address}
            explorerLink={explorerLink}
          />
        )
      })}
    </Box>
  )
}

export default SuggestedTokenFromServer
