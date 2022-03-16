import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'

import { Button, Col, Modal, Row, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import TokenWillReceive from './tokenWillReceive'
import WithdrawCardToken from './withdrawCardToken'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import { useAccount, useWallet } from '@senhub/providers'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [lptAmount, setLptAmount] = useState(0)
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()

  const onSubmit = async () => {
    try {
      await checkInitializedAccount()
      const { txId } = await window.sen_balancer.removeLiquidity(
        poolAddress,
        new BN(lptAmount),
      )
      notifySuccess('Withdraw', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  const checkInitializedAccount = async () => {
    for (const mint of poolData.mints) {
      const tokenAccount = await utils.token.associatedAddress({
        owner: new web3.PublicKey(walletAddress),
        mint,
      })
      if (!accounts[tokenAccount.toBase58()]) {
        const { wallet, splt } = window.sentre
        if (!wallet) throw new Error('Login fist')
        await splt.initializeAccount(mint.toBase58(), walletAddress, wallet)
      }
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)}>Withdraw</Button>
      {/* Modal deposit */}
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
                  <Col>
                    <Button className="btn-toke-name">
                      <span className="title">USDC</span>
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn-toke-name">
                      <span className="title">USDC</span>
                    </Button>
                  </Col>
                  <Col>
                    <Button className="btn-toke-name">
                      <span className="title">USDC</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <WithdrawCardToken />
          </Col>
          <Col span={24}>
            <Row gutter={[0, 14]} style={{ width: '100%' }}>
              <Col span={24}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  You will reveice
                </Typography.Text>
              </Col>
              <TokenWillReceive />
            </Row>
          </Col>
          <Col span={24}>
            <Button className="balansol-btn" type="primary" block>
              Withdraw
            </Button>
          </Col>
        </Row>
        {/* <Input onChange={(e) => setLptAmount(Number(e.target.value))} />
        <Button onClick={onSubmit}>Submit</Button> */}
      </Modal>
    </Fragment>
  )
}

export default Withdraw
