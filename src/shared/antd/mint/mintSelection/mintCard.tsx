import { useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useWallet, util } from '@sentre/senhub'
import { numeric } from '@sentre/senhub/dist/shared/util'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'

import { useJupiterTokens } from './hooks/useJupiterTokens'
import { SOL_ADDRESS, SOL_DECIMALS } from 'stat/constants/sol'
import { useMintPrice } from 'hooks/useMintPrice'

const Verification = () => {
  return (
    <Tooltip title={'Safe to Go'}>
      <IonIcon
        name="checkmark-circle"
        style={{
          color: '#18A0FB',
          backgroundColor: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
        }}
      />
    </Tooltip>
  )
}

type ButtonOpenExplorerProps = { mintAddress: string }
const ButtonOpenExplorer = ({ mintAddress }: ButtonOpenExplorerProps) => {
  return (
    <Button
      type="text"
      icon={<IonIcon name="open-outline" />}
      onClick={() => window.open(util.explorer(mintAddress))}
    />
  )
}

export type MintSelectionProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
}
const MintCard = ({ mintAddress, onClick = () => {} }: MintSelectionProps) => {
  const [price, setPrice] = useState(0)
  const jptTokens = useJupiterTokens()
  const {
    wallet: { lamports },
  } = useWallet()
  const { getTokenPrice } = useMintPrice()

  const isNativeSol = [SOL_ADDRESS].includes(mintAddress)
  const solBalance = utils.undecimalize(lamports, SOL_DECIMALS)
  const solCardBg = isNativeSol
    ? {
        background:
          'linear-gradient(269.1deg, rgba(0, 255, 163, 0.1) 0%, rgba(220, 31, 255, 0.1) 100%)',
        borderRadius: 8,
      }
    : {}

  const formatNumric = (value: string | number) =>
    numeric(value).format('0,0.[000]')

  useEffect(() => {
    ;(async () => {
      const price = await getTokenPrice(mintAddress)
      setPrice(price)
    })()
  }, [getTokenPrice, mintAddress])

  return (
    <Card
      bodyStyle={{ padding: 8 }}
      style={{ boxShadow: 'unset', cursor: 'pointer', ...solCardBg }}
      bordered={false}
      onClick={() => onClick(mintAddress)}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <MintAvatar mintAddress={mintAddress} size={36} />
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            {/* Mint symbol */}
            <Space>
              <Typography.Text>
                <MintSymbol mintAddress={mintAddress} />
              </Typography.Text>
              {jptTokens?.verify(mintAddress) && <Verification />}
            </Space>
            {/* Mint name */}
            <Space size={4}>
              <Typography.Text type="secondary" className="caption">
                <MintName mintAddress={mintAddress} />
              </Typography.Text>
              {/* Sol Native - Subtext */}
              {isNativeSol && (
                <Typography.Text type="secondary" className="caption">
                  Native
                </Typography.Text>
              )}
            </Space>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: 'right' }}>
          <Space>
            {isNativeSol && (
              // SOL infomation
              <Space direction="vertical">
                <Space size={4}>
                  <Typography.Text style={{ color: ' #03e1ff' }}>
                    ◎
                  </Typography.Text>
                  <Typography.Text>{formatNumric(solBalance)}</Typography.Text>
                </Space>
                <Typography.Text type="secondary" className="caption">
                  {formatNumric(price * Number(solBalance))} $
                </Typography.Text>
              </Space>
            )}

            {/*  Button open explorer */}
            <ButtonOpenExplorer mintAddress={mintAddress} />
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default MintCard
