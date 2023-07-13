import { useCallback, useState } from 'react'
import { useDebounce } from 'react-use'
import { useGetMintDecimals, util } from '@sentre/senhub'
import { BN } from '@coral-xyz/anchor'
import { utilsBN } from '@sen-use/web3'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import MintInput from 'components/mintInput'
import { MintAmount, MintAvatar, MintSymbol } from '@sen-use/app'

import { useBuyToken } from 'hooks/launchpad/actions/useBuyToken'
import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'
import { useLaunchpadWeights } from 'hooks/launchpad/useLaunchpadWeights'
import { useLaunchpad } from 'hooks/launchpad/useLaunchpad'
import { usePoolData } from 'hooks/launchpad/usePoolData'
import { calcOutGivenInSwap } from 'helper/oracles'

const BuyToken = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const [amount, setAmount] = useState(0)
  const [askAmount, setAskAmount] = useState(new BN(0))

  const launchpadData = useLaunchpad(launchpadAddress)!
  const poolData = usePoolData(launchpadAddress)!
  const { onBuyToken, loading } = useBuyToken()
  const { balance } = useWrapAccountBalance(launchpadData.stableMint.toBase58())
  const currentWeights = useLaunchpadWeights(launchpadAddress, 5000)
  const getMintDecimals = useGetMintDecimals()
  const isStarted = Date.now() / 1000 > launchpadData.startTime.toNumber()

  const handleBuyToken = () => {
    if (!amount) return
    onBuyToken({
      amount,
      launchpadAddress,
    })
  }

  const syncsAskAmount = useCallback(async () => {
    const bidDecimals = await getMintDecimals({
      mintAddress: launchpadData.stableMint.toBase58(),
    })
    const bidAmount = utilsBN.decimalize(amount, bidDecimals!)
    const totalWeights = currentWeights[0] + currentWeights[1]
    const askAmount = calcOutGivenInSwap(
      bidAmount,
      poolData.reserves[0],
      poolData.reserves[1],
      currentWeights[0] / totalWeights,
      currentWeights[1] / totalWeights,
      poolData.fee.add(poolData.taxFee),
    )

    return setAskAmount(askAmount)
  }, [
    amount,
    currentWeights,
    getMintDecimals,
    launchpadData.stableMint,
    poolData,
  ])
  useDebounce(syncsAskAmount, 500, [syncsAskAmount])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        {/* Ask amount */}
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text type="secondary">You pay</Typography.Text>
            <Card
              bordered={false}
              className="card-swap"
              bodyStyle={{ padding: 0 }}
            >
              <MintInput
                amount={amount}
                selectedMint={launchpadData.stableMint.toBase58()}
                onChangeAmount={(val) => setAmount(Number(val))}
                mintSelection={
                  <Space className="mint-display">
                    <MintAvatar mintAddress={launchpadData.stableMint} />
                    <MintSymbol mintAddress={launchpadData.stableMint} />
                  </Space>
                }
              />
            </Card>
          </Space>
        </Col>
        {/* Bid amount */}
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text type="secondary">You receive</Typography.Text>
            <Row align="middle">
              <Col flex="auto">
                <Space className="mint-display">
                  <MintAvatar mintAddress={launchpadData.mint} />
                  <MintSymbol mintAddress={launchpadData.mint} />
                </Space>
              </Col>
              <Col>
                <Typography.Title level={3}>
                  <MintAmount
                    mintAddress={launchpadData.mint}
                    amount={askAmount}
                  />
                </Typography.Title>
              </Col>
            </Row>
          </Space>
        </Col>

        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Typography.Text type="secondary">Rate</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>
                <Space>
                  <Typography.Text>1</Typography.Text>
                  <MintSymbol mintAddress={launchpadData.mint} />
                  <Typography.Text>=</Typography.Text>
                  <MintAmount
                    mintAddress={launchpadData.mint}
                    amount={askAmount}
                    formatter={(val) => {
                      return util
                        .numeric(
                          !Number(val) ? 0 : Number(amount) / Number(val),
                        )
                        .format('0.[0000]')
                    }}
                  />
                  <MintSymbol mintAddress={launchpadData.stableMint} />
                </Space>
              </Typography.Text>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Button
            size="large"
            type="primary"
            block
            onClick={handleBuyToken}
            loading={loading}
            disabled={!amount || amount > balance || !isStarted}
          >
            Purchase
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default BuyToken
