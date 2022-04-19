import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MintInput from 'app/components/mintInput'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'

export default function BidInput() {
  const {
    swap: { bidAmount, bidMint, askMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintsSwap = useMintsCanSwap()

  useEffect(() => {
    dispatch(setSwapState({ bidMint: mintsSwap?.[0] || '' })).unwrap()
  }, [dispatch, mintsSwap])

  const onChange = (val: string) => {
    dispatch(setSwapState({ bidAmount: val, isReverse: false })).unwrap()
  }
  // Ignore askMint in mints
  const filteredMints = useMemo(
    () => mintsSwap.filter((value) => value !== askMint),
    [askMint, mintsSwap],
  )

  return (
    <MintInput
      amount={bidAmount}
      selectedMint={bidMint}
      onSelect={(mint) => dispatch(setSwapState({ bidMint: mint }))}
      onChangeAmount={onChange}
      mints={filteredMints}
    />
  )
}
