import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import MintInput from 'app/components/mintInput'
import { MintSelection } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'
import { useAppRouter } from 'app/hooks/useAppRouter'

const BidInput = () => {
  const {
    swap: { bidAmount, bidMint, askMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintsSwap = useMintsCanSwap()
  const { pushHistory } = useAppRouter()
  const { search } = useLocation()
  const query = useMemo(() => new URLSearchParams(search), [search])
  const tradePair = query.get('pair') || ''
  const bidMintQS = tradePair.split('_')[0]

  useEffect(() => {
    if (bidMint) return
    if (!bidMintQS) {
      dispatch(setSwapState({ bidMint: mintsSwap?.[0] || '' }))
      return
    }
    dispatch(setSwapState({ bidMint: bidMintQS }))
  }, [bidMintQS, bidMint, dispatch, mintsSwap])

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
          value={bidMint}
          onChange={(mint) => {
            dispatch(setSwapState({ bidMint: mint }))
            pushHistory(`/swap?pair=${mint}_${askMint}`)
          }}
          style={{ background: '#394360' }}
        />
      }
    />
  )
}

export default BidInput
