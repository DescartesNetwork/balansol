import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useRouteSwap } from 'app/hooks/swap/useRouteSwap'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'
import { useReversedSwap } from 'app/hooks/useReversedSwap'

export default function AskInput() {
  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const { askAmount } = useRouteSwap()

  const { estimateTokenOut } = useReversedSwap()
  const mintsSwap = useMintsCanSwap()

  useEffect(() => {
    const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
    dispatch(setSwapState({ askMint: newMintSwap[0] }))
  }, [bidMint, dispatch, mintsSwap])

  const onChange = async (val: string) => {
    // Temp to fix later. Currently, estimateTokenOut don't go right
    const newBidAmount = await estimateTokenOut(val)

    dispatch(
      setSwapState({
        bidAmount: newBidAmount,
      }),
    )
  }

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
        mints={mintsSwap.filter((value) => value !== bidMint)}
        ratioButton={null}
      />
    </Card>
  )
}
