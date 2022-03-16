import { useDispatch, useSelector } from 'react-redux'

import { Row } from 'antd'
import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsSwap } from 'app/hooks/useMintsSwap'

export default function BidInput() {
  const {
    swap: { bidAmount, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintsSwap = useMintsSwap()

  return (
    <Row>
      <MintInput
        amount={bidAmount}
        selectedMint={bidMint}
        onSelect={(mint) => dispatch(setSwapState({ bidMint: mint }))}
        onChangeAmount={(val) => dispatch(setSwapState({ bidAmount: val }))}
        mints={mintsSwap}
      />
    </Row>
  )
}
