import React, { FC } from 'react'
import { Box, Icon, Tooltip, Typography, Link, Divider } from '../atoms'
import Button from '../atoms/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'

const Header: FC = () => {
  const path = useLocation().pathname
  const navigate = useNavigate()
  const isHome = path === '/'
  const theme = useTheme()

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='space-between' px={10} pt={10}>
        <Button.Unstyled
          onClick={() => {
            navigate('/')
          }}
        >
          <Box display='flex' alignItems='center'>
            <Box mr='10px'>
              <img src='favicon.ico' height='50px' alt='icon' />
            </Box>
            <Typography variant='h1' fontWeight={500}>
              GSN
            </Typography>
            &nbsp; &nbsp;
            <Box
              component='span'
              sx={{
                opacity: 0.5
              }}
            >
              <Typography variant='h1'>{isHome ? 'Relay Servers info' : 'Relay Servers'}</Typography>
            </Box>
          </Box>
        </Button.Unstyled>
        {isHome && (
          <Box display='flex' alignItems='center' gap={15}>
            <Tooltip
              placement='bottom-end'
              title={
                <>
                  <Typography variant='h6' fontWeight={700}>
                    Beta 3.0 Version
                  </Typography>
                  <br />
                  <Typography variant='h6' fontWeight={400} color={theme.palette.primary.mainBrightWhite}>
                    This is the status page of the new GSN v3.0.0-beta.3 network. For the previous GSN v2 network see
                  </Typography>
                  &nbsp;
                  <Link href='https://relays-v2.opengsn.org/' textDecorationColor={theme.palette.primary.mainCTA}>
                    <Typography variant='h6' fontWeight={400} color={theme.palette.primary.mainCTA}>
                      here
                    </Typography>
                  </Link>
                </>
              }
            >
              <Box
                bgcolor={theme.palette.primary.cardBG}
                borderRadius={theme.borderRadius.small}
                width={56}
                height={56}
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{
                  cursor: 'pointer'
                }}
              >
                <Icon.Question />
              </Box>
            </Tooltip>
            <Box width='244px'>
              <Button.CTA
                onClick={() => {
                  navigate('/new')
                }}
                text='Register New Relay +'
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box mt='13px' mb={5}>
        <Divider />
      </Box>
    </>
  )
}

export default Header
