import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MintInput from 'app/components/mintInput'
import { MintSelection } from 'shared/antd/mint'

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
    if (bidMint) return
    dispatch(setSwapState({ bidMint: mintsSwap?.[0] || '' }))
  }, [bidMint, dispatch, mintsSwap])

  const onChange = (val: string) => {
    dispatch(setSwapState({ bidAmount: val, isReverse: false }))
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
      onChangeAmount={onChange}
      mints={filteredMints}
      mintSelection={
        <MintSelection
          value={askMint}
          onChange={(mint) => dispatch(setSwapState({ bidMint: mint }))}
          style={{ background: '#394360' }}
        />
      }
    />
  )
}
