import { useTheme, util } from '@sentre/senhub'

import { Card, Col, Row, Space, Typography } from 'antd'
import LaunchpadProfile from 'view/launchpad/components/launchpadProfile'
import LaunchpadLineChart from 'view/launchpad/launchpadLineChart'
import TransHistory from './transHistory'

import { LaunchpadCardProps } from 'view/launchpad/components/launchpadCard'
import { useTokenPrice } from 'hooks/launchpad/useTokenPrice'

const LaunchpadInfo = ({ launchpadAddress }: LaunchpadCardProps) => {
  const theme = useTheme()
  const mintPrice = useTokenPrice(launchpadAddress)
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <LaunchpadProfile launchpadAddress={launchpadAddress} />
      </Col>
      <Col span={24}>
        <Card
          bordered={false}
          style={{ background: theme === 'dark' ? '#394360' : '#ffffff' }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Row align="middle">
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">Token price</Typography.Text>
                <Typography.Title
                  level={4}
                  style={{ color: theme === 'dark' ? '#63E0B3' : '' }}
                >
                  ${util.numeric(mintPrice).format('0,0.[000]')}
                </Typography.Title>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">
                  AVG users price
                </Typography.Text>
                <Typography.Title
                  level={4}
                  style={{ color: theme === 'dark' ? '#63E0B3' : '' }}
                >
                  $0.5
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <LaunchpadLineChart />
      </Col>
      <Col span={24}>
        <TransHistory launchpadAddress={launchpadAddress} />
      </Col>
    </Row>
  )
}

export default LaunchpadInfo
