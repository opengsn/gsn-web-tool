import { CircularProgress, Button } from '../../../components/atoms'

const LoadingButton = () => {
  return (
    <Button.Contained disabled>
      <CircularProgress></CircularProgress>
    </Button.Contained>
  )
}

export default LoadingButton
