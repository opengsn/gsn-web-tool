import { useFormik } from 'formik'
import { useEffect } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import { Flip, toast } from 'react-toastify'

import { isIP } from 'is-ip'

import { ROUTES } from '../../constants/routes'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { PingResponse } from '../../types'
import { deleteRelayData, fetchRelayData } from './relaySlice'

export default function RelayUrlForm () {
  const relay = useAppSelector((state) => state.relay)
  const relayData: PingResponse = relay.relay
  const relayDataFetched = (Object.keys(relayData).length > 0)

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
    onSubmit: values => {
      // eslint-disable-next-line no-useless-escape
      const regexpURL = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)/i

      const withHttps = (url: string) => `https://${url}`
      const removeTrailingSlashes = (url: string) => url.replace(/\/+$/, '')
      const withGetaddr = (url: string) => !/\/getaddr/i.test(url) ? `${url}/getaddr` : url

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
        toast.error('Please enter a valid URL', { position: 'top-center', hideProgressBar: true, autoClose: 1300, closeOnClick: true, transition: Flip })
        return
      }

      dispatch(fetchRelayData(URL)).then((res) => {
        if (res.type.includes('fulfilled')) {
          const search = createSearchParams({ relayUrl: URL }).toString()
          navigate({ pathname: ROUTES.DetailedView, search })
        } else if (res.type.includes('rejected')) {
          const urlFormatMessage = 'endpoint must return relay config as JSON and include HTTP or HTTPS'
          if (URL.includes('localhost')) {
            toast.info(
              urlFormatMessage,
              { autoClose: 2000, closeButton: true }
            )
          }
        }
      }).catch((err) => {
        toast.error('error while fetching relay data. try refreshing the page')
        console.error(err)
      })
    }
  })

  if (!relayDataFetched) {
    return (<>
      <Col></Col>
      <Col md="auto" className="flex-fill">
        {relay.loading
          ? <span>Loading data...</span>
          : null}
        {relay.errorMsg !== ''
          ? <Alert variant="danger">
            <span>Error: {relay.errorMsg}</span>
          </Alert>
          : null}
        <Form className="row" onSubmit={getRelayForm.handleSubmit}>
          <Form.Label htmlFor="url">Relay URL
            <InputGroup><Form.Control
              id="url"
              name="url"
              type="text"
              onChange={getRelayForm.handleChange}
              value={getRelayForm.values.url}
            />
            </InputGroup></Form.Label>
          <Button variant="success" type="submit">Fetch data</Button>
        </Form>
      </Col>
      <Col></Col>
    </>)
  }

  if (relay.errorMsg !== '') {
    return <>
      <Alert variant='danger'><span>{relay.errorMsg}</span></Alert>
    </>
  }

  return <div>Relay data is already fetched. Refresh the page.</div>
}
