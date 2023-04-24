import { FC } from 'react'
import { useToken } from 'wagmi'
import { Box, Button, Icon, Typography } from '../../../../../components/atoms'
import { useCopyToClipboard } from '../../../../../hooks'
import { truncateFromMiddle } from '../../../../../utils'
// import { useNavigate } from 'react-router-dom'

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
  const [_, copyToClipboard] = useCopyToClipboard()
  // const navigate = useNavigate()
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
        <Button.Icon
          onClick={() => {
            // navigate(link)
          }}
        >
          <Icon.Redirect />
        </Button.Icon>
      </Box>
    </Box>
  )
}

export default TokenSelectOption
