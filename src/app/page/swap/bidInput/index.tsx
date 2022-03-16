import { useDispatch, useSelector } from 'react-redux'

import { Card } from 'antd'
import InputSwap from 'app/components/inputSwap'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'

export default function BidInput() {
  const {
    swap: { bidAmount, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <InputSwap
        amount={bidAmount}
        selectedMint={bidMint}
        onSelect={(mint) => dispatch(setSwapState({ bidMint: mint }))}
        onChangeAmount={(val) => dispatch(setSwapState({ bidAmount: val }))}
      />
    </Card>
  )
}
