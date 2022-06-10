import { useState } from 'react'
import { useSelector } from 'react-redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useUI } from '@senhub/providers'

import { Row, Col, Space, Typography, Popover, Tooltip, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import Deposit from './deposit'
import Withdraw from './withdraw'

import { asyncWait } from 'shared/util'
import { AppState } from 'app/model'

type InfoProps = { title: string; value: string }
const Info = ({ title, value }: InfoProps) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <Space align="center">
      <Tooltip title="Copied" visible={copied} arrowPointAtCenter>
        <CopyToClipboard text={value}>
          <Button
            type="text"
            size="small"
            icon={<IonIcon name="copy-outline" />}
            onClick={onCopy}
          />
        </CopyToClipboard>
      </Tooltip>
      <Space direction="vertical" size={4}>
        <Typography.Text type="secondary">{title}</Typography.Text>
        <Typography.Text style={{ wordBreak: 'break-all' }}>
          {value}
        </Typography.Text>
      </Space>
    </Space>
  )
}

const Header = ({ poolAddress }: { poolAddress: string }) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 768

  return (
    <Row gutter={[24, 24]} justify="space-between">
      <Col md={18} xs={24}>
        <Space>
          <PoolAvatar poolAddress={poolAddress} size={32} />
          <Typography.Title level={4}>Balansol LP</Typography.Title>
          <Popover
            placement="bottom"
            content={
              <Space direction="vertical">
                <Info title="Pool Address" value={poolAddress} />
                <Info title="LPT Address" value={poolData.mintLpt.toBase58()} />
              </Space>
            }
          >
            <Button
              type="text"
              style={{ marginLeft: -4 }}
              icon={<IonIcon name="alert-circle-outline" />}
            />
          </Popover>
        </Space>
      </Col>
      <Col span={isMobile ? 24 : undefined}>
        <Space style={{ width: '100%' }}>
          <Withdraw poolAddress={poolAddress} />
          <Deposit poolAddress={poolAddress} />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
