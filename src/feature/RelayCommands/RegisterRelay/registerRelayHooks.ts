import { useAppDispatch } from '../../../hooks'
import { highlightStepError, highlightStepIdle } from './registerRelaySlice'

export const useDefaultStateSwitchers = () => {
  const dispatch = useAppDispatch()
  return {
    onMutate () {
      dispatch(highlightStepIdle())
    },
    onError () {
      dispatch(highlightStepError())
    }
  }
}
