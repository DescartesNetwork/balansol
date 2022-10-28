import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useMintDecimals, useTheme, util } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { MintSymbol } from '@sen-use/app'
import { LaunchpadCardProps } from './launchpadCard'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useCheques } from 'hooks/launchpad/useCheques'
import { AppState } from 'model'

const Sold = ({ launchpadAddress }: LaunchpadCardProps) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const filteredCheques = useCheques(launchpadAddress)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0
  const amount = utilsBN.undecimalize(launchpadData?.startReserves[0], decimals)
  const theme = useTheme()

  const participants = useMemo(() => {
    let total = 0
    let price = new BN(0)
    const boughtAddress: string[] = []
    for (const address of filteredCheques) {
      const { authority, amount } = cheques[address]
      price = price.add(amount)
      if (boughtAddress.includes(authority.toBase58())) continue
      boughtAddress.push(authority.toBase58())
      total += 1
    }
    return { total, price: utilsBN.undecimalize(price, decimals) }
  }, [cheques, decimals, filteredCheques])

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Sold</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            {util.numeric(participants.price).format('0,0.[000]')} /
            {util.numeric(amount).format('0,0.[000]')}{' '}
            <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
          </Typography.Title>
          <Typography.Title level={5}>
            (
            {util
              .numeric(Number(participants.price) / Number(amount))
              .format('%')}
            )
          </Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Progress
          strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
          percent={(0 / Number(amount)) * 100}
          showInfo={false}
          className="sold-progress"
        />
      </Col>
      <Col span={24}>
        <Space>
          <Typography.Text type="secondary">Participants:</Typography.Text>
          <Typography.Text>{participants.total}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Sold
