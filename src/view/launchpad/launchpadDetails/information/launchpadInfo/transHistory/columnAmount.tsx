import { BN } from '@coral-xyz/anchor'

import { MintAmount, MintSymbol } from '@sen-use/app'
import { Space } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

type ColumnAmountProps = {
  launchpadAddress: string
  amount: BN
  isBaseAmount?: boolean
}

const ColumnAmount = ({
  launchpadAddress,
  amount,
  isBaseAmount = false,
}: ColumnAmountProps) => {
  const {
    launchpadData: { stableMint, mint },
  } = useLaunchpadData(launchpadAddress)
  const mintAddress = isBaseAmount ? stableMint : mint

  return (
    <Space>
      <MintAmount amount={amount} mintAddress={mintAddress} />
      <MintSymbol mintAddress={mintAddress} />
    </Space>
  )
}

export default ColumnAmount
