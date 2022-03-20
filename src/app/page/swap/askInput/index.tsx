import { useDispatch, useSelector } from 'react-redux'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'

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
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
      />
    </Card>
  )
}
