import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useCheques } from './useCheques'
import { AppState } from 'model'

export const useAVGPrice = (launchpadAddress: string) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const filteredCheques = useCheques(launchpadAddress)

  const getPrice = useCallback(
    (chequeAddress: string) => {
      const { askAmount, bidAmount } = cheques[chequeAddress]
      if (!askAmount.toNumber()) return 0
      return bidAmount.toNumber() / askAmount.toNumber()
    },
    [cheques],
  )

  const avgPrice = useMemo(() => {
    if (!filteredCheques.length) return 0
    let totalPrice = 0
    for (const chequeAddress of filteredCheques)
      totalPrice += getPrice(chequeAddress)

    return totalPrice / filteredCheques.length
  }, [filteredCheques, getPrice])

  return avgPrice
}
