import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useUI } from '@sentre/senhub'

import { Card, Spin } from 'antd'
import MintInput from 'components/mintInput'
import { MintSelection } from '@sen-use/app'

import { AppDispatch, AppState } from 'model'
import { setSwapState } from 'model/swap.controller'
import { useAppRouter } from 'hooks/useAppRouter'
import configs from 'configs'

const AskInput = () => {
  const { askMint, askAmount, loading, isReverse, bidAmount } = useSelector(
    (state: AppState) => state.swap,
  )
  const {
    ui: { theme },
  } = useUI()
  const dispatch = useDispatch<AppDispatch>()
  const { getAllQuery } = useAppRouter()
  const { ask_mint } = getAllQuery<{ ask_mint: string }>()

  useEffect(() => {
    if (!askMint) {
      const defaultAskMint = ask_mint || configs.sol.askMintDefault
      dispatch(setSwapState({ askMint: defaultAskMint }))
    }
  }, [askMint, ask_mint, dispatch])

  const onChange = async (askAmount: string) => {
    dispatch(
      setSwapState({
        askAmount,
        isReverse: true,
        bidAmount: '',
        loading: true,
      }),
    ).unwrap()
  }

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <Spin spinning={loading && !isReverse && !!Number(bidAmount)}>
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
      </Spin>
    </Card>
  )
}

export default AskInput
