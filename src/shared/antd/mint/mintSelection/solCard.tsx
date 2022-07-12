import { useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useWallet, util } from '@sentre/senhub'
import { numeric } from '@sentre/senhub/dist/shared/util'

import { Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'
import { MintCardActions, Verification } from './mintCard'

import { useJupiterTokens } from './hooks/useJupiterTokens'

export const SOL_ADDRESS = '11111111111111111111111111111111'
export const SOL_DECIMALS = 9
export const DEFAULT_FORMAT_NUMRIC = '0,0.[000]'

export type SolCardProps = {
  onClick?: (mintAddress: string) => void
}
const SolCard = ({ onClick = () => {} }: SolCardProps) => {
  const [price, setPrice] = useState(0)
  const jptTokens = useJupiterTokens()
  const {
    wallet: { lamports },
  } = useWallet()

  const solBalance = utils.undecimalize(lamports, SOL_DECIMALS)

  const formatNumric = (value: string | number, format?: string) =>
    numeric(value).format(format || DEFAULT_FORMAT_NUMRIC)

  useEffect(() => {
    ;(async () => {
      const { price } = await util.fetchCGK('solana')
      setPrice(price)
    })()
  }, [])

  return (
    <Card
      bodyStyle={{ padding: 8 }}
      style={{
        boxShadow: 'unset',
        cursor: 'pointer',
        background:
          'linear-gradient(269.1deg, rgba(0, 255, 163, 0.1) 0%, rgba(220, 31, 255, 0.1) 100%)',
        borderRadius: 8,
      }}
      bordered={false}
      onClick={() => onClick(SOL_ADDRESS)}
    >
      <Row gutter={[16, 16]}>
        <Col>
          <MintAvatar mintAddress={SOL_ADDRESS} size={36} />
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            {/* Mint symbol */}
            <Space>
              <Typography.Text>
                <MintSymbol mintAddress={SOL_ADDRESS} />
              </Typography.Text>
              {jptTokens?.verify(SOL_ADDRESS) && <Verification />}
            </Space>
            {/* Mint name */}
            <Typography.Text type="secondary" className="caption">
              <MintName mintAddress={SOL_ADDRESS} />
              Native
            </Typography.Text>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: 'right' }}>
          <Space align="start">
            {/* SOL infomation */}
            <Tooltip
              title={
                <Typography.Text className="caption" style={{ color: '#fff' }}>
                  {formatNumric(solBalance, '0,0.[00000]')} SOL ≈{' '}
                  {formatNumric(price * Number(solBalance), '0,0.[000000]')} $
                </Typography.Text>
              }
            >
              <Typography.Text style={{ color: ' #03e1ff' }}>◎</Typography.Text>
            </Tooltip>
            <Typography.Text>{formatNumric(solBalance)}</Typography.Text>
            {/*  Button open explorer */}
            <MintCardActions address={SOL_ADDRESS} />
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default SolCard
