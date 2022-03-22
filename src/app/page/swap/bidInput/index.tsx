import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsSwap } from 'app/hooks/useMintsSwap'

export default function BidInput() {
  const {
    swap: { bidAmount, bidMint, askMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintsSwap = useMintsSwap()

  useEffect(() => {
    dispatch(setSwapState({ bidMint: mintsSwap[0] }))
  }, [dispatch, mintsSwap])

  const onChange = (val: string) => {
    dispatch(setSwapState({ bidAmount: val }))
  }

  return (
    <MintInput
      amount={bidAmount}
      selectedMint={bidMint}
      onSelect={(mint) => dispatch(setSwapState({ bidMint: mint }))}
      onChangeAmount={onChange}
      mints={mintsSwap.filter((value) => value !== askMint)}
    />
  )
}
