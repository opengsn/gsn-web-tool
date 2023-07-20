import { FC } from 'react'
import { useToken } from 'wagmi'
import { Box, Button, Icon, Typography } from '../../../../../components/atoms'
import { useCopyToClipboard } from '../../../../../hooks'
import { truncateFromMiddle } from '../../../../../utils'

interface IProps {
  address: string
  chainId: number
  handleChangeToken: (address: string) => void
  checked: boolean
}

const sx = {
  display: 'flex',
  border: '1px solid black',
  alignItems: 'center',
  width: 'fit-content',
  paddingX: '10px',
  borderRadius: '10px'
}

const TokenSelectOption: FC<IProps> = ({ address, chainId, handleChangeToken, checked }) => {
  const [, copyToClipboard] = useCopyToClipboard()
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
      <Box sx={sx}>
        <Icon.Token />
        <Box ml='10px'>
          <Typography fontWeight={600}>{tokenData?.name ?? 'Token name:'}</Typography>
        </Box>
        <Button.Text
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await copyToClipboard(address)
          }}
        >
          <Box component='span' marginRight='15px'>
            <Typography>{truncateFromMiddle(address, 15)}</Typography>
          </Box>
          <Icon.CopyToClipboard />
        </Button.Text>
        <a href={`https://etherscan.io/address/${address}`} target='_blank' rel="noreferrer">
          <Icon.Redirect />
        </a>
      </Box>
    </Box>
  )
}

export default TokenSelectOption
