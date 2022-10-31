import { MintAmount, MintSymbol } from '@sen-use/app/dist'
import { Button, Col, Row, Space, Typography } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useExchanges } from 'hooks/launchpad/useExchanges'

type YourBoughtProps = {
  launchpadAddress: string
}

const YourBought = ({ launchpadAddress }: YourBoughtProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const completed = Number(launchpadData.endTime) < Date.now() / 1000
  const { totalAsk } = useExchanges(launchpadAddress, true)

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Your bought</Typography.Text>
      </Col>
      <Col>
        {!completed ? (
          <Typography.Title level={3}>
            <MintAmount
              mintAddress={launchpadData.mint}
              amount={totalAsk}
              formatter="0,0.[000]"
            />{' '}
            <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
          </Typography.Title>
        ) : (
          <Button type="primary" size="large">
            <Space size={4}>
              Claim {totalAsk}
              <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
            </Space>
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default YourBought
