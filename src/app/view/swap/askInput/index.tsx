import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useUI } from '@senhub/providers'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'
import { MintSelection } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'
import { useAppRouter } from 'app/hooks/useAppRouter'

const AskInput = () => {
  const { askMint, bidMint, askAmount } = useSelector(
    (state: AppState) => state.swap,
  )
  const {
    ui: { theme },
  } = useUI()
  const dispatch = useDispatch<AppDispatch>()
  const mintsSwap = useMintsCanSwap()
  const { getAllQuery } = useAppRouter()
  const { ask_mint } = getAllQuery<{ ask_mint: string }>()

  useEffect(() => {
    if (askMint) return
    if (!ask_mint) {
      const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
      dispatch(setSwapState({ askMint: newMintSwap?.[0] || '' })).unwrap()
      return
    }
    dispatch(setSwapState({ askMint: ask_mint })).unwrap()
  }, [ask_mint, askMint, bidMint, dispatch, mintsSwap])

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
            }}
            style={{ background: theme === 'dark' ? '#394360' : '#F2F4FA' }}
          />
        }
      />
    </Card>
  )
}

export default AskInput
