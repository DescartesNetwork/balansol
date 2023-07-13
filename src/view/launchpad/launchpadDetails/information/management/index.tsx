import { useMemo, useState } from 'react'
import { web3, BN } from '@coral-xyz/anchor'
import { getAnchorProvider } from '@sentre/senhub'
import { MintAmount, MintAvatar, MintSymbol, notifyError } from '@sen-use/app'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { notifySuccess } from 'helper'
import { usePoolData } from 'hooks/launchpad/usePoolData'
import { useLaunchpad } from 'hooks/launchpad/useLaunchpad'
import { useLptSupply } from 'hooks/useLptSupply'

type ManagementProps = {
  launchpadAddress: string
}

const Management = ({ launchpadAddress }: ManagementProps) => {
  const [loading, setLoading] = useState(false)
  const launchpadData = useLaunchpad(launchpadAddress)!
  const poolData = usePoolData(launchpadAddress)
  const { supply } = useLptSupply(poolData.mintLpt)

  const completed = Date.now() / 1000 >= launchpadData.endTime.toNumber()

  const assets = useMemo(() => {
    const { stableMint, mint } = launchpadData
    const { reserves } = poolData
    const stableAmount = reserves[1].gt(launchpadData.startReserves[1])
      ? reserves[1].sub(launchpadData.startReserves[1])
      : new BN(0)

    return [
      { mint, amount: reserves[0] },
      {
        mint: stableMint,
        amount: stableAmount,
      },
    ]
  }, [launchpadData, poolData])

  const onWithdraw = async () => {
    setLoading(true)
    try {
      let { tx } = await window.launchpad.claim({
        launchpad: new web3.PublicKey(launchpadAddress),
        sendAndConfirm: false,
      })
      const { transaction } =
        await window.balansol.createRemoveLiquidityTransaction(
          launchpadData.pool,
          supply,
        )

      const provider = getAnchorProvider()!
      const txId = await provider.sendAndConfirm(tx.add(transaction))
      notifySuccess('Withdraw', txId)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

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
        <Button
          block
          type="primary"
          size="large"
          onClick={onWithdraw}
          loading={loading}
          disabled={!completed || assets[0].amount.isZero()}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default Management
