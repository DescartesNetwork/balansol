import { useState } from 'react'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

const Price = () => {
  const [reversed, setReversed] = useState(false)

  return (
    <Space>
      <Button
        type="text"
        onClick={() => setReversed(!reversed)}
        shape="circle"
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
      <Typography.Text>100</Typography.Text>
      <Typography.Text>
        {!reversed ? (
          <MintSymbol mintAddress={'1111111111111111111111'} />
        ) : (
          <MintSymbol mintAddress={'11111111111111111111111111111111111'} />
        )}
        {' / '}
        {!reversed ? (
          <MintSymbol mintAddress={'1111111111111111111111'} />
        ) : (
          <MintSymbol mintAddress={'1111111111111111111111'} />
        )}
      </Typography.Text>
    </Space>
  )
}

export default Price
