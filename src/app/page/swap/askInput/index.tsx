import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row } from 'antd'
import InputSwap from 'app/components/inputSwap'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'

export default function AskInput() {
  const {
    swap: { askMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const askAmount = useMemo(() => {
    return '0'
  }, [])

  return (
    <Row>
      <InputSwap
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
      />
    </Row>
  )
}
