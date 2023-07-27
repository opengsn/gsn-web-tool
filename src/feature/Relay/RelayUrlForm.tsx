import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

import { Box, Typography, TextField, Button, ButtonType, Alert } from '../../components/atoms'

import { isIP } from 'is-ip'

import { ROUTES } from '../../constants/routes'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { PingResponse } from '../../types'
import { deleteRelayData, fetchRelayData } from './relaySlice'
import { texts } from '../../texts'

export default function RelayUrlForm() {
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = Object.keys(relayData).length > 0
  const [error, setError] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // clean up upon coming back from 'details' page
    const relayUrlSearchParam = searchParams.get('relayUrl')
    if (relayDataFetched && relay.errorMsg === '') {
      dispatch(deleteRelayData())
    }
    if (relayUrlSearchParam !== null) {
      searchParams.delete('relayUrl')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams, relayDataFetched, dispatch, relay.errorMsg])

  const getRelayForm = useFormik({
    initialValues: {
      url: relay.relayUrl
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setError(null)
      // eslint-disable-next-line no-useless-escape
      const regexpURL = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)/i

      const withHttps = (url: string) => `https://${url}`
      const removeTrailingSlashes = (url: string) => url.replace(/\/+$/, '')
      const withGetaddr = (url: string) => (!/\/getaddr/i.test(url) ? `${url}/getaddr` : url)

      const formatURL = (url: string) => withHttps(withGetaddr(removeTrailingSlashes(url)))
      const formatLocalhost = (url: string) => withGetaddr(removeTrailingSlashes(url))

      const extractedURL = values.url.match(regexpURL)

      let URL: string
      if (values.url.includes('localhost')) {
        URL = formatLocalhost(values.url)
      } else if (extractedURL !== null) {
        URL = formatURL(extractedURL[0])
        if (isIP(extractedURL[0].split(':')[0])) {
          URL = formatLocalhost(values.url)
        }
      } else {
        setError('Please enter a valid URL')
        return
      }

      dispatch(fetchRelayData(URL))
        .then((res) => {
          if (res.type.includes('fulfilled')) {
            const search = createSearchParams({ relayUrl: URL }).toString()
            navigate({ pathname: ROUTES.DetailedView, search })
          } else if (res.type.includes('rejected')) {
            const urlFormatMessage = 'endpoint must return relay config as JSON and include HTTP or HTTPS'
            if (URL.includes('localhost')) {
              setError(urlFormatMessage)
            } else {
              setError('error while fetching relay data. URL is wrong')
            }
          }
        })
        .catch((err) => {
          setError('error while fetching relay data. try refreshing the page')
          console.error(err)
        })
    }
  })

  if (!relayDataFetched) {
    return (
      <Box pt={8} textAlign='center' mx='auto' width={'900px'}>
        <Box mb={8}>
          <Typography variant={'h5'}>Relay URL</Typography>
        </Box>
        <Box mb='20px' textAlign='start'>
          <Typography variant={'body1'}>{texts.relayUrl.description}</Typography>
        </Box>
        <Box component='form' onSubmit={getRelayForm.handleSubmit}>
          <Box mb={8}>
            <TextField onChange={getRelayForm.handleChange} value={getRelayForm.values.url} name='url' />
            <Box my={1}>
              {error !== null && (
                <Alert severity='error'>
                  <Typography variant='h6' fontWeight={600}>
                    {error}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Box>
          <Box width='380px' mx='auto' height='70px'>
            <Button.Contained size='large' type={ButtonType.SUBMIT}>
              Fetch data
            </Button.Contained>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Alert severity='error'>
      {' '}
      <Typography variant='h6' fontWeight={600}>
        Relay data is already fetched. Refresh the page.
      </Typography>
    </Alert>
  )
}
