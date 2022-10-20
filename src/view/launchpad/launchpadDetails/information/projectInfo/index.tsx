import moment from 'moment'
import { util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'
import { MintName, MintSymbol } from '@sen-use/app'
import Resource from './resource'

import { DATE_FORMAT } from 'constant'

const ProjectInfo = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Resource />
      </Col>

      {/* Description */}
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Description</Typography.Title>
          <Typography.Paragraph style={{ margin: 0 }}>
            13M USDT tokens from the Public Sale will be distributed (unpaused)
            to Balansol Liquidity Bootstrapping Pool (LBP) on Oct 3rd at around
            10:00 am UTC. The LBP will run for 48 hours, starting from 10:00 am
            UTC Oct 3rd, and ending at 10:00 am UTC Oct 5th. The weight of
            Balancer Pool will be adjusted according to the market buying power.
          </Typography.Paragraph>
        </Space>
      </Col>

      {/* Token info */}
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Token information</Typography.Title>

          <Space direction="vertical">
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Token Name: </span>
              <MintName mintAddress={''} /> (<MintSymbol mintAddress={''} />)
            </Typography.Text>
            <Typography.Text
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(util.explorer(''), '_blank')}
            >
              <span style={{ color: '#9CA1AF' }}>Token Address: </span>
              {util.shortenAddress('sVsAdfsdfsdasdasdfsdKDDsd', 6)}
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Token supply: </span>
              {util.numeric(2342342342).format('0,0.[00000]')} (
              <MintSymbol mintAddress={''} />)
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad supply: </span>
              {util.numeric(2342342342).format('0,0.[00000]')} (
              <MintSymbol mintAddress={''} />)
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad start time: </span>
              {moment(Date.now()).format(DATE_FORMAT)}
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad end time: </span>
              {moment(Date.now()).format(DATE_FORMAT)}
            </Typography.Text>
          </Space>
        </Space>
      </Col>
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Social media</Typography.Title>
          <Resource />
        </Space>
      </Col>
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Leading venture capital</Typography.Title>
          <Resource />
        </Space>
      </Col>
    </Row>
  )
}

export default ProjectInfo
