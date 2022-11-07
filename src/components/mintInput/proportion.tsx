import React, { useMemo } from 'react'
import { useTheme } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'

import { Radio, Space, Typography } from 'antd'

import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'
import { useOracles } from 'hooks/useOracles'

const PROPORTIONS = [50, 100]

type ProportionProps = {
  selectedMint: string
  amount: number | string
  portionValue: number
  onChangeAmount?: (val: string, invalid?: boolean) => void
}

const Proportion = ({
  amount,
  selectedMint,
  portionValue,
  onChangeAmount,
}: ProportionProps) => {
  const theme = useTheme()
  const { balance, amount: bigintBalance } = useWrapAccountBalance(selectedMint)
  const { undecimalizeMintAmount } = useOracles()

  let proportionActive = useMemo(() => {
    let activePortion = 0
    for (const idx in PROPORTIONS) {
      if (!balance) break
      const proportion = PROPORTIONS[idx]
      const proportionVal = (balance * proportion) / 100

      if (Number(amount).toFixed(4) === proportionVal.toFixed(4))
        activePortion = proportion
    }
    return activePortion
  }, [amount, balance])

  const onClick = async () => {
    if (!onChangeAmount) return
    const newAmountBN = new BN(bigintBalance.toString())
      .mul(new BN(portionValue))
      .divRound(new BN(100))
    const newAmount = await undecimalizeMintAmount(newAmountBN, selectedMint)
    onChangeAmount(newAmount)
  }

  const bg_default = theme === 'dark' ? '#394360' : '#ced0d7'

  return (
    <Space size={4} direction="vertical" key={portionValue}>
      <Radio.Button
        className="proportion-btn"
        disabled={!onChangeAmount}
        onClick={onClick}
        style={{
          background: portionValue <= proportionActive ? '#63e0b3' : bg_default,
        }}
      />
      <Typography.Text type="secondary" className="caption">
        {`${portionValue}%`}
      </Typography.Text>
    </Space>
  )
}

export default Proportion
