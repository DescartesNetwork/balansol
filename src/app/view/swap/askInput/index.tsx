import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useMintsCanSwap } from 'app/hooks/swap/useMintsCanSwap'
import { useRouteReversedSwap } from 'app/hooks/swap/useRouteReversedSwap'
import { useRouteSwap } from 'app/hooks/swap/useRouteSwap'

export default function AskInput() {
  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const { askAmount } = useRouteSwap()

  const [askAmountReverse, setAskAmountReverse] = useState('')
  const { getBestRoute } = useRouteReversedSwap()

  const mintsSwap = useMintsCanSwap()

  useEffect(() => {
    const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
    dispatch(setSwapState({ askMint: newMintSwap[0] }))
  }, [bidMint, dispatch, mintsSwap])

  const onChange = async (val: string) => {
    // let isDiff = Number(val) !== Number(askAmountReverse)
    // setAskAmountReverse(val);
    // if(isDiff){
    //   // dispatch(
    //   //   setSwapState({
    //   //     bidAmount: (Number(val)*2).toString(),
    //   //   }),
    //   // )
    // }
    await setAskAmountReverse(val)
    let routeSwapInfo = await getBestRoute(val)
    console.log('routeSwapInfo: ', val, routeSwapInfo)
  }

  const clearAskAmountReverse = useCallback(() => {
    if (Number(askAmount) === Number(askAmountReverse)) {
      setAskAmountReverse('')
    }
  }, [askAmount, askAmountReverse])

  useEffect(() => {
    clearAskAmountReverse()
  }, [clearAskAmountReverse])

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmountReverse ? askAmountReverse : askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
        mints={mintsSwap.filter((value) => value !== bidMint)}
        ratioButton={null}
      />
    </Card>
  )
}
