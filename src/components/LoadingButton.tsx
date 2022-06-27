import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const LoadingButton = () => {
  return <Button disabled><Spinner size="sm" animation="border"></Spinner></Button>
}

export default LoadingButton
