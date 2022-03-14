import { useDispatch, useSelector } from 'react-redux'

import { Row } from 'antd'
import InputSwap from 'app/components/inputSwap'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'

export default function BidInput() {
  const {
    swap: { bidAmount, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  return (
    <Row>
      <InputSwap
        amount={bidAmount}
        selectedMint={bidMint}
        onSelect={(mint) => dispatch(setSwapState({ bidMint: mint }))}
        onChangeAmount={(val) => dispatch(setSwapState({ bidAmount: val }))}
      />
    </Row>
  )
}
