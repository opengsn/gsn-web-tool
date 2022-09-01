import { Link } from 'react-router-dom'

import { PlusCircleFill } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import GsnStatusNew from './NetworkCard/NetworkCard'
import NetworkLinksNew from './NetworkLinksNew'

import { useAppSelector } from '../../hooks'

export default function ChainsList () {
  const networks = useAppSelector((state) => state.networkList.networks)

  return <Container fluid className="p-2">
    <div className="d-flex align-items-center p-2 text-dark">
      <img src="favicon.ico" className="mb-0 lh-100" height="50px" alt="" />
      <div className="lh-100 mx-2">
        <h2>GSN (v3 beta) Relay Servers</h2>
        <b>Note</b> This is the status page of the new v3 (beta). For the current v2 network see <a
          href="https://relays-v2.opengsn.org">here</a>
      </div>
      <hr />
    </div>

    <Row className="px-3">
      <Col md={3}>
        <NetworkLinksNew />
      </Col>
      <Col md={{ span: 3, offset: 6 }} className="">
        <Row style={{ height: '150px' }}>
          <Link to='/manage'>
            <Button size="lg" variant="success" className="h-100 w-100">
              <PlusCircleFill size={24} style={{
                display: 'inline-block',
                marginBottom: '3px',
                marginRight: '4px'
              }} /> Add new
            </Button>
          </Link>
        </Row>
      </Col>
    </Row>

    {Object.values(networks).map((x) => {
      return <div key={x.chain.name}>
        {x.chain.gsn.relayHubAddress !== undefined && x.errorMsg === ''
          ? <GsnStatusNew network={x} />
          : null}
      </div>
    })}
  </Container>
}
