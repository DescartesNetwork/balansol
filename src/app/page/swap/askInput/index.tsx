import { useDispatch, useSelector } from 'react-redux'

import { Row } from 'antd'
import InputSwap from 'app/components/inputSwap'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useAskAmount } from 'app/hooks/useAskAmount'

export default function AskInput() {
  const {
    swap: { askMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const askAmount = useAskAmount()

  const onChange = (val: string) => {
    dispatch(setSwapState({ bidAmount: String(Number(val) * 2) }))
  }
  return (
    <Row>
      <InputSwap
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
      />
    </Row>
  )
}
