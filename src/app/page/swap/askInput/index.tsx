import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useRouteSwap } from 'app/hooks/useRouteSwap'
import { useMintsSwap } from 'app/hooks/useMintsSwap'

export default function AskInput() {
  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const { askAmount } = useRouteSwap()
  const mintsSwap = useMintsSwap()

  const onChange = (val: string) => {
    dispatch(setSwapState({ bidAmount: String(Number(val) * 2) }))
  }

  useEffect(() => {
    const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
    dispatch(setSwapState({ askMint: newMintSwap[0] }))
  }, [bidMint, dispatch, mintsSwap])

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
        mints={mintsSwap.filter((value) => value !== bidMint)}
      />
    </Card>
  )
}
