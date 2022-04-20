import { Fragment, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import WithdrawFullSide from './fullSide'
import WithdrawSingleSide from './singleSide'

import { AppState } from 'app/model'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const mints = useMemo(
    () => poolData.mints.map((e) => e.toBase58()),
    [poolData.mints],
  )
  const [visible, setVisible] = useState(false)
  const [lptAmount, setLptAmount] = useState('')
  const [selectedMints, setSelectedMints] = useState<string[]>(mints)

  const isSelectedAll = selectedMints.length === poolData.mints.length

  return (
    <Fragment>
      <Button className="btn-outline" onClick={() => setVisible(true)} block>
        Withdraw
      </Button>
      {/* Modal withdraw */}
      <Modal
        title={<Typography.Title level={4}>Withdraw</Typography.Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        className="modal-balansol"
        footer={null}
        destroyOnClose={true}
        centered={true}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[0, 24]} className="withdraw">
          <Col span={24}>
            <Row gutter={[0, 12]}>
              <Col span={24}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  You want to reveice
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
            </Row>
          </Col>
          <Col span={24}>
            <MintInput
              selectedMint={poolData.mintLpt.toBase58()}
              amount={lptAmount}
              onChangeAmount={(amount) => setLptAmount(amount)}
              mintLabel={
                <Typography.Text type="secondary">Balansol LP</Typography.Text>
              }
              mintAvatar={<PoolAvatar poolAddress={poolAddress} />}
              unit="LP"
            />
          </Col>
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
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Withdraw
