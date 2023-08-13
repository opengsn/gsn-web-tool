import { FC } from 'react'
import { useToken } from 'wagmi'
import { Box, Button, Icon, Typography } from '../../../../../components/atoms'
import BlockExplorerUrl from '../../../../GsnStatus/components/BlockExplorerUrl'

interface IProps {
  address: string
  chainId: number
  handleChangeToken: (address: string) => void
  checked: boolean
  explorerLink: string | null
}

const sx = {
  display: 'flex',
  border: '1px solid black',
  alignItems: 'center',
  width: 'fit-content',
  padding: '10px',
  borderRadius: '10px'
}

const TokenSelectOption: FC<IProps> = ({ address, chainId, handleChangeToken, checked, explorerLink }) => {
  const { data: tokenData } = useToken({
    address: address as any,
    chainId
  })

  return (
    <Box display='flex' alignItems='center' mt='10px'>
      <Box>
        <Button.Radio
          onChange={() => {
            handleChangeToken(address)
          }}
          checked={checked}
        />
      </Box>
      &nbsp;
      <Box sx={sx}>
        <Icon.Token /> {/* token from json */}
        <Box ml='10px'>
          <Typography variant='h5' fontWeight={600}>
            {tokenData?.name ?? 'Token name:'}
          </Typography>
        </Box>
        &nbsp;
        <BlockExplorerUrl address={address} url={explorerLink ? `${explorerLink}/${address}` : undefined} />
      </Box>
    </Box>
  )
}

export default TokenSelectOption
