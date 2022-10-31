import { useMemo } from 'react'
import { MintAmount, MintAvatar, MintSymbol } from '@sen-use/app'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import usePoolData from 'hooks/launchpad/usePoolData'
import { useLaunchpad } from 'hooks/launchpad/useLaunchpad'

type ManagementProps = {
  launchpadAddress: string
}

const Management = ({ launchpadAddress }: ManagementProps) => {
  const launchpadData = useLaunchpad(launchpadAddress)!
  const poolData = usePoolData(launchpadAddress)

  const assets = useMemo(() => {
    const { stableMint, mint } = launchpadData
    const { reserves } = poolData
    return [
      { mint, amount: reserves[0] },
      {
        mint: stableMint,
        amount: reserves[1].sub(launchpadData.startReserves[1]),
      },
    ]
  }, [launchpadData, poolData])

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Space>
          <Typography.Text type="secondary">
            <IonIcon name="information-circle-outline" />
          </Typography.Text>
          <Typography.Text type="secondary" className="caption">
            The launchpad had completed, you can withdraw your tokens.
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text type="secondary" className="caption">
            Your Assets
          </Typography.Text>
          <Row>
            {assets.map(({ mint, amount }) => (
              <Col span={12} key={mint.toBase58()}>
                <Space>
                  <MintAvatar mintAddress={mint.toBase58()} />
                  <MintAmount amount={amount} mintAddress={mint} />
                  <MintSymbol mintAddress={mint} />
                </Space>
              </Col>
            ))}
          </Row>
        </Space>
      </Col>
      <Col span={24} />
      <Col span={24}>
        <Button block type="primary" size="large">
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default Management
