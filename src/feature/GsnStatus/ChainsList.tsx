import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import NetworkCard from './Network/NetworkCard'
import NetworkLinksNew from './components/NetworkGroups'

import { useAppSelector } from '../../hooks'
import Header from './components/Header'
import RegisterNewButton from './components/RegisterNewButton'

export default function ChainsList () {
  const networks = useAppSelector((state) => state.networkList.networks)

  return <>
    <Header />

    {/* mx-0 prevents horizontal scrollbar from appearing within container-fluid  */}
    <Row className="mx-0">
      <Col sm={6} md={3}>
        <NetworkLinksNew />
      </Col>
      <Col md={{ span: 2, offset: 7 }} className="">
        <Row style={{ height: '120px' }}>
          <RegisterNewButton />
        </Row>
      </Col>
    </Row>

    {Object.values(networks).map((x) => {
      return <div key={x.chain.name}>
        {x.chain.gsn.relayHubAddress !== undefined && x.errorMsg === ''
          ? <NetworkCard network={x} />
          : null}
      </div>
    })}
  </>
}
