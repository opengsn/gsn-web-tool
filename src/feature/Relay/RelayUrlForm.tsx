import { useFormik } from 'formik'
import { useEffect } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

import { Flip, toast } from 'react-toastify'

import { Box, Typography, VariantType, TextField, Button, ButtonType } from '../../components/atoms'

import { isIP } from 'is-ip'

import { ROUTES } from '../../constants/routes'
import { useAppDispatch, useAppSelector, useIsDesktop } from '../../hooks'
import { PingResponse } from '../../types'
import { deleteRelayData, fetchRelayData } from './relaySlice'
import { texts } from '../../texts'

export default function RelayUrlForm() {
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = Object.keys(relayData).length > 0

  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()

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
        toast.dismiss()
        toast.error('Please enter a valid URL', {
          position: 'top-center',
          hideProgressBar: true,
          autoClose: 1300,
          closeOnClick: true,
          transition: Flip
        })
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
              toast.info(urlFormatMessage, { autoClose: 2000, closeButton: true })
            }
          }
        })
        .catch((err) => {
          toast.error('error while fetching relay data. try refreshing the page')
          console.error(err)
        })
    }
  })

  if (!relayDataFetched) {
    return (
      <Box pt={{ xs: '30px', md: '130px' }} textAlign='center' mx='auto' width={{ md: '900px', xs: '95%' }}>
        <Box mb={{ md: '70px', xs: '20px' }}>
          <Typography variant={isDesktop ? VariantType.H1 : VariantType.H3}>Relay URL</Typography>
        </Box>
        <Box mb='20px' textAlign='start'>
          <Typography variant={isDesktop ? VariantType.H5 : VariantType.XSMALL}>{texts.relayUrl.description}</Typography>
        </Box>
        <Box component='form' onSubmit={getRelayForm.handleSubmit}>
          <Box mb={{ xs: '10px', md: '40px' }}>
            <TextField onChange={getRelayForm.handleChange} value={getRelayForm.values.url} name='url' />
          </Box>
          <Box width={{ md: '380px' }} mx='auto' height='70px'>
            <Button.Contained size='large' type={ButtonType.SUBMIT}>
              Fetch data
            </Button.Contained>
          </Box>
        </Box>
      </Box>
    )
  }

  return <div>Relay data is already fetched. Refresh the page.</div>
}
