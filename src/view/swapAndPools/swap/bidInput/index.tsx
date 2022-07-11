import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useUI } from '@sentre/senhub'

import MintInput from 'components/mintInput'
import { MintSelection } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'model'
import { setSwapState } from 'model/swap.controller'
import { useMintsCanSwap } from 'hooks/swap/useMintsCanSwap'
import { useAppRouter } from 'hooks/useAppRouter'
import configs from 'configs'

const BidInput = () => {
  const { bidAmount, bidMint, askMint } = useSelector(
    (state: AppState) => state.swap,
  )
  const dispatch = useDispatch<AppDispatch>()
  const {
    ui: { theme },
  } = useUI()
  const mintsSwap = useMintsCanSwap()
  const { getAllQuery } = useAppRouter()
  const { bid_mint } = getAllQuery<{ bid_mint: string }>()

  useEffect(() => {
    if (!bidMint) {
      const defaultBidMint = bid_mint || configs.sol.bidMintDefault
      dispatch(setSwapState({ bidMint: defaultBidMint }))
    }
  }, [bidMint, bid_mint, dispatch])

  const onChange = (val: string) => {
    dispatch(
      setSwapState({
        bidAmount: val,
        isReverse: false,
        askAmount: '',
        loading: true,
      }),
    )
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
          }}
          style={{ background: theme === 'dark' ? '#394360' : '#F2F4FA' }}
        />
      }
    />
  )
}

export default BidInput
