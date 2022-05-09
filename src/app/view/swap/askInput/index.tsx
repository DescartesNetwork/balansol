import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'
import { MintSelection } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'
import { useAppRouter } from 'app/hooks/useAppRouter'

const AskInput = () => {
  const {
    swap: { askMint, bidMint, askAmount },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintsSwap = useMintsCanSwap()
  const { pushHistory } = useAppRouter()
  const { search } = useLocation()
  const query = useMemo(() => new URLSearchParams(search), [search])
  const tradePair = query.get('pair') || ''
  const askMintQS = tradePair.split('_')[1]

  useEffect(() => {
    if (askMint) return
    if (!askMintQS) {
      const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
      dispatch(setSwapState({ askMint: newMintSwap?.[0] || '' })).unwrap()
      return
    }
    dispatch(setSwapState({ askMint: askMintQS })).unwrap()
  }, [askMintQS, askMint, bidMint, dispatch, mintsSwap])

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
            onChange={(mint) => {
              dispatch(setSwapState({ askMint: mint })).unwrap()
              pushHistory(`/swap?pair=${bidMint}_${mint}`)
            }}
            style={{ background: '#394360' }}
          />
        }
      />
    </Card>
  )
}

export default AskInput
