import { Fragment, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import MintInput from 'components/mintInput'
import { PoolAvatar } from 'components/pools/poolAvatar'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from 'shared/antd/mint'
import WithdrawFullSide from './fullSide'
import WithdrawSingleSide from './singleSide'

import { AppState } from 'model'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [lptAmount, setLptAmount] = useState('')
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const mints = useMemo(() => {
    if (!poolData) return []
    return poolData.mints.map((e) => e.toBase58())
  }, [poolData])
  const [selectedMints, setSelectedMints] = useState<string[]>(mints)

  const isSelectedAll = selectedMints.length === poolData?.mints.length

  return (
    <Fragment>
      <Button ghost onClick={() => setVisible(true)} block>
        Withdraw
      </Button>
      {/* Modal withdraw */}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        centered
        closeIcon={<IonIcon name="close-outline" />}
      >
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
                      className={`btn-toke-name ${
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
                          className={`btn-toke-name ${selected}`}
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
              {!isSelectedAll && (
                <Col span={24}>
                  <Space align="center" size={4}>
                    <IonIcon
                      name="warning-outline"
                      style={{ fontSize: '16px' }}
                    />
                    <Typography.Text type="secondary">
                      You cannot withdraw more than 30% of the available LP
                    </Typography.Text>
                  </Space>
                </Col>
              )}
            </Row>
          </Col>
          <Col span={24}>
            <MintInput
              selectedMint={poolData?.mintLpt.toBase58()}
              amount={lptAmount}
              onChangeAmount={(amount) => setLptAmount(amount)}
              mintLabel={<Typography.Text>Balansol LP</Typography.Text>}
              mintAvatar={<PoolAvatar poolAddress={poolAddress} />}
              unit="LP"
              force
              ratioButton={!isSelectedAll && null}
            />
          </Col>
          <Col span={24}>
            {isSelectedAll ? (
              <WithdrawFullSide
                poolAddress={poolAddress}
                lptAmount={lptAmount}
                onSuccess={() => setVisible(false)}
              />
            ) : (
              <WithdrawSingleSide
                poolAddress={poolAddress}
                mintAddress={selectedMints[0]}
                lptAmount={lptAmount}
                onSuccess={() => setVisible(false)}
              />
            )}
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Withdraw
