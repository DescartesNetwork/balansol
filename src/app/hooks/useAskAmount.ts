import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

export const useAskAmount = () => {
  const {
    swap: { bidAmount },
  } = useSelector((state: AppState) => state)

  return String(Number(bidAmount) / 2)
}
