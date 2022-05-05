import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'
import { MintSelection } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'

const AskInput = () => {
  const {
    swap: { askMint, bidMint, askAmount },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintsSwap = useMintsCanSwap()

  useEffect(() => {
    if (askMint && askMint !== bidMint) return
    const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
    dispatch(setSwapState({ askMint: newMintSwap?.[0] || '' })).unwrap()
  }, [askMint, bidMint, dispatch, mintsSwap])

  const onChange = async (askAmount: string) => {
    dispatch(
      setSwapState({
        askAmount,
        isReverse: true,
      }),
    ).unwrap()
  }

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmount}
        selectedMint={askMint}
        onChangeAmount={onChange}
        ratioButton={null}
        mintSelection={
          <MintSelection
            value={askMint}
            onChange={(mint) =>
              dispatch(setSwapState({ askMint: mint })).unwrap()
            }
            style={{ background: '#394360' }}
          />
        }
      />
    </Card>
  )
}

export default AskInput
