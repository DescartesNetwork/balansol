import { useTheme, util } from '@sentre/senhub'

import { Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import LaunchpadProfile from 'view/launchpad/components/launchpadProfile'
import LaunchpadLineChart from 'view/launchpad/launchpadLineChart'
import TransHistory from './transHistory'

import { LaunchpadCardProps } from 'view/launchpad/components/launchpadCard'
import { useTokenPrice } from 'hooks/launchpad/useTokenPrice'
import { useAVGPrice } from 'hooks/launchpad/useAVGPrice'
import IonIcon from '@sentre/antd-ionicon'

const LaunchpadInfo = ({ launchpadAddress }: LaunchpadCardProps) => {
  const theme = useTheme()
  const mintPrice = useTokenPrice(launchpadAddress)
  const avgPrice = useAVGPrice(launchpadAddress)
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <LaunchpadProfile launchpadAddress={launchpadAddress} />
      </Col>
      <Col span={24}>
        <Card
          bordered={false}
          style={{
            background: theme === 'dark' ? '#394360' : '#ffffff',
            borderRadius: 20,
          }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Row align="middle">
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">Token price</Typography.Text>
                <Typography.Title level={4} type="success">
                  ${util.numeric(mintPrice).format('0,0.[000]')}
                </Typography.Title>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">
                  <Space className="align-middle-icon" align="center">
                    Avg. purchase price
                    <Tooltip title="This price is based on the average of all purchased users.">
                      <IonIcon
                        name="information-circle-outline"
                        style={{ fontSize: 24 }}
                      />
                    </Tooltip>
                  </Space>
                </Typography.Text>
                <Typography.Title level={4} type="success">
                  ${util.numeric(avgPrice).format('0,0.[000]')}
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <LaunchpadLineChart launchpadAddress={launchpadAddress} />
      </Col>
      <Col span={24}>
        <TransHistory launchpadAddress={launchpadAddress} />
      </Col>
    </Row>
  )
}

export default LaunchpadInfo
