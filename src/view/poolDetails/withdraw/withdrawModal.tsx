import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Button, Checkbox, Col, Row, Space, Tag, Typography } from 'antd'
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
  const [acceptWithdrawLimit, setAcceptWithdrawLimit] = useState(true)
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )
  const { supply } = useLptSupply(poolData.mintLpt)

  const supplyInNumber = useMemo(() => {
    return Number(utils.undecimalize(BigInt(supply.toString()), LPTDECIMALS))
  }, [supply])

  const recommendedMax = useMemo(() => {
    return Number(((supplyInNumber * 30) / 100).toFixed(LPTDECIMALS))
  }, [supplyInNumber])

  const maxAmount = useMemo(() => {
    return !acceptWithdrawLimit || recommendedMax > balance
      ? balance
      : recommendedMax
  }, [acceptWithdrawLimit, balance, recommendedMax])

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
              <Button onClick={() => setLptAmount(`${maxAmount}`)} size="small">
                Max
              </Button>
            )
          }
          footer={
            !isSelectedAll && (
              <Col span={24}>
                <Tag
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '5px 16px',
                    whiteSpace: 'unset',
                  }}
                  color="gold"
                >
                  <Space align="center" size={6}>
                    <Checkbox
                      className="warning-checkbox"
                      checked={acceptWithdrawLimit}
                      onChange={() =>
                        setAcceptWithdrawLimit(!acceptWithdrawLimit)
                      }
                    />
                    <Typography.Text style={{ color: 'inherit' }}>
                      Prevent to withdraw more than 30% (Currently{' '}
                      {util
                        .numeric(Number(lptAmount) / supplyInNumber)
                        .format('0,0.[00]%')}
                      ) of the total LP.
                    </Typography.Text>
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
            withdrawableMax={maxAmount}
          />
        )}
      </Col>
    </Row>
  )
}

export default WithdrawModal
