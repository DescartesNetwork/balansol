import { MintAmount, MintSymbol } from '@sen-use/app'
import { Button, Col, Row, Space, Typography } from 'antd'

import { utils, web3 } from '@project-serum/anchor'
import { useCallback, useEffect, useState } from 'react'
import { splt } from '@sentre/senhub'

import { notifySuccess } from 'helper'
import { useExchanges } from 'hooks/launchpad/useExchanges'
import { useLaunchpad } from 'hooks/launchpad/useLaunchpad'

type YourBoughtProps = {
  launchpadAddress: string
}

const YourBought = ({ launchpadAddress }: YourBoughtProps) => {
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState(true)
  const launchpadData = useLaunchpad(launchpadAddress)
  const completed = Number(launchpadData.endTime) < Date.now() / 1000
  const { totalAsk } = useExchanges(launchpadAddress, true)

  const onClaim = async () => {
    setLoading(true)
    try {
      let { txId } = await window.launchpad.redeem({
        launchpad: new web3.PublicKey(launchpadAddress),
      })
      notifySuccess('Claim', txId)
      setClaimed(true)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const fetchBalance = useCallback(async () => {
    const master = await window.launchpad.deriveMasterAddress(launchpadAddress)
    const treasury = await utils.token.associatedAddress({
      mint: launchpadData.mint,
      owner: master,
    })
    const accountData = await splt.getAccountData(treasury.toBase58())
    setClaimed(!Number(accountData.amount.toString()))
  }, [launchpadAddress, launchpadData.mint])
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Your bought</Typography.Text>
      </Col>
      <Col>
        {!completed ? (
          <Typography.Title level={3}>
            <Space>
              <MintAmount
                mintAddress={launchpadData.mint}
                amount={totalAsk}
                formatter="0,0.[000]"
              />
              <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
            </Space>
          </Typography.Title>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={onClaim}
            loading={loading}
            disabled={claimed}
          >
            <Space size={4}>
              {claimed ? 'Claimed ' : 'Claim '}
              <MintAmount
                mintAddress={launchpadData.mint}
                amount={totalAsk}
                formatter="0,0.[000]"
              />
              <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
            </Space>
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default YourBought
