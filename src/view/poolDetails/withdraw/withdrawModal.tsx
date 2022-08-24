import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'
import BN from 'bn.js'

import { Button, Col, Row, Space, Tag, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from '@sen-use/app'
import MintInput from 'components/mintInput'
import { PoolAvatar } from 'components/pools/poolAvatar'
import WithdrawFullSide from './fullSide'
import WithdrawSingleSide from './singleSide'

import { useLptSupply } from 'hooks/useLptSupply'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

import { LPTDECIMALS } from 'constant'
import { AppState } from 'model'

type WithdrawModalProps = {
  poolAddress: string
  hideModal: () => void
}

const WithdrawModal = ({ poolAddress, hideModal }: WithdrawModalProps) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const mints = useMemo(() => {
    if (!poolData) return []
    return poolData.mints.map((e) => e.toBase58())
  }, [poolData])
  const [selectedMints, setSelectedMints] = useState<string[]>(mints)
  const [lptAmount, setLptAmount] = useState('')
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )
  const { supply } = useLptSupply(poolData.mintLpt)

  const withdrawableMax = useMemo(() => {
    const thirtyPercentSupply = supply.mul(new BN(30)).div(new BN(100))
    return Number(
      utils.undecimalize(BigInt(thirtyPercentSupply.toString()), LPTDECIMALS),
    )
  }, [supply])

  const isSelectedAll = selectedMints.length === poolData?.mints.length

  return (
    <Row gutter={[24, 24]} className="withdraw">
      <Col span={24}>
        <Typography.Title level={4}>Withdraw</Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              You want to receive
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Row gutter={[12, 12]}>
              {/* Button select all */}
              <Col>
                <Button
                  className={`btn-token-name ${
                    isSelectedAll ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedMints(mints)}
                >
                  <span className="title">All</span>
                </Button>
              </Col>
              {/* Mints Symbol Button */}
              {mints.map((mintAddress) => {
                let selected = selectedMints.includes(mintAddress)
                  ? 'selected'
                  : ''
                return (
                  <Col key={mintAddress}>
                    <Button
                      className={`btn-token-name ${selected}`}
                      onClick={() => setSelectedMints([mintAddress])}
                    >
                      <span className="title">
                        <MintSymbol mintAddress={mintAddress} />
                      </span>
                    </Button>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <MintInput
          selectedMint={poolData?.mintLpt.toBase58()}
          amount={lptAmount}
          onChangeAmount={(amount) => setLptAmount(amount)}
          mintLabel={<Typography.Text ellipsis>Balansol LP</Typography.Text>}
          mintAvatar={<PoolAvatar poolAddress={poolAddress} max={2} />}
          unit="LP"
          force
          ratioButton={
            !isSelectedAll && (
              <Button
                onClick={() =>
                  setLptAmount(
                    `${withdrawableMax > balance ? balance : withdrawableMax}`,
                  )
                }
                size="small"
              >
                Max
              </Button>
            )
          }
          footer={
            !isSelectedAll && (
              <Col span={24}>
                <Tag
                  style={{ width: '100%', border: 'none', padding: '5px 16px' }}
                  color="red"
                >
                  <Space align="start" size={4}>
                    <IonIcon
                      name="warning-outline"
                      style={{ fontSize: '16px', color: '#f2323f' }}
                    />
                    You cannot withdraw more than 30% (
                    {util.numeric(withdrawableMax).format('0,0.[00]a')}) of the
                    Liquidity Provider
                  </Space>
                </Tag>
              </Col>
            )
          }
        />
      </Col>
      <Col span={24}>
        {isSelectedAll ? (
          <WithdrawFullSide
            poolAddress={poolAddress}
            lptAmount={lptAmount}
            onSuccess={hideModal}
          />
        ) : (
          <WithdrawSingleSide
            poolAddress={poolAddress}
            mintAddress={selectedMints[0]}
            lptAmount={lptAmount}
            onSuccess={hideModal}
            withdrawableMax={
              withdrawableMax > balance ? balance : withdrawableMax
            }
          />
        )}
      </Col>
    </Row>
  )
}

export default WithdrawModal
