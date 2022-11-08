import { Button, Card, Col, Row, Typography } from 'antd'
import { useAppRouter } from 'hooks/useAppRouter'

import './index.less'

const Banner = () => {
  const { pushHistory } = useAppRouter()
  return (
    <Card className="banner" bordered={false}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Typography.Title style={{ color: '#F3F3F5' }}>
            The{' '}
            <span style={{ color: '#081438' }}>
              Liquidity Bootstrapping Launchpad
            </span>
            <br /> for new projects on Solana
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text style={{ color: '#CED0D7', fontSize: 20 }}>
            Full support in project incubation
          </Typography.Text>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Button
            onClick={() => pushHistory('/launchpad-create')}
            size="large"
            type="primary"
          >
            Create a launchpad
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default Banner
