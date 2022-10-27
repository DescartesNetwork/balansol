import { MintSymbol } from '@sen-use/app'
import { Col, Row, Typography } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

type PriceProps = {
  direction?: string
  launchpadAddress: string
}

const Price = ({ direction = 'row', launchpadAddress }: PriceProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Price</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>
          1 <MintSymbol mintAddress={launchpadData?.mint.toBase58()} /> = 0.5{' '}
          <MintSymbol mintAddress={launchpadData?.stableMint.toBase58()} />
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Price
