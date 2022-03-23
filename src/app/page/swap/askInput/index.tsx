import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { BN } from '@project-serum/anchor'

import { Card } from 'antd'
import MintInput from 'app/components/mintInput'

import { AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useRouteSwap } from 'app/hooks/useRouteSwap'
import { useMintsSwap } from 'app/hooks/useMintsSwap'
import { calcInGivenOutSwap, getMintInfo } from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'
import { useReversedSwap } from 'app/hooks/useReversedSwap'

export default function AskInput() {
  const {
    swap: { askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const { askAmount } = useRouteSwap()

  const { estimateTokenOut } = useReversedSwap()
  const mintsSwap = useMintsSwap()
  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  useEffect(() => {
    const newMintSwap = mintsSwap.filter((value) => value !== bidMint)
    dispatch(setSwapState({ askMint: newMintSwap[0] }))
  }, [bidMint, dispatch, mintsSwap])

  const onChange = async (val: string) => {
    const newBidAmount = await estimateTokenOut(val)

    dispatch(
      setSwapState({
        bidAmount: newBidAmount,
      }),
    )
  }

  return (
    <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
      <MintInput
        amount={askAmount}
        selectedMint={askMint}
        onSelect={(mint) => dispatch(setSwapState({ askMint: mint }))}
        onChangeAmount={onChange}
        mints={mintsSwap.filter((value) => value !== bidMint)}
        disableProportionButton={true}
      />
    </Card>
  )
}
