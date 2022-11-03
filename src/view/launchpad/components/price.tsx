import { util } from '@sentre/senhub'

import { Col, Row, Typography } from 'antd'

import { useTokenPrice } from 'hooks/launchpad/useTokenPrice'

type PriceProps = {
  direction?: string
  launchpadAddress: string
}

const Price = ({ direction = 'row', launchpadAddress }: PriceProps) => {
  const mintPrice = useTokenPrice(launchpadAddress)
  return (
    <Row gutter={[12, 12]} style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Price</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>
          ${util.numeric(mintPrice).format('0,0.[000]')}{' '}
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Price
