import React, { useMemo } from 'react'

import { Radio, Space, Typography } from 'antd'

import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'
import { useMint, useUI } from '@sentre/senhub'

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
  const {
    ui: { theme },
  } = useUI()
  const balance = useWrapAccountBalance(selectedMint)
  const { getDecimals } = useMint()

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
    const mintDecimal = await getDecimals(selectedMint)

    onChangeAmount(
      String(
        Math.floor(((balance * portionValue) / 100) * 10 ** mintDecimal) /
          10 ** mintDecimal,
      ),
    )
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
