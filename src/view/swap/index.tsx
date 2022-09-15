import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AskInput from './askInput'
import BidInput from './bidInput'
import ActionReview from './reviewSwap'
import SettingArea from './settingArea'
import SwapInfo from 'view/swap/swapInfo'

import { setSwapState } from 'model/swap.controller'
import { AppState } from 'model'
import { useAppRouter } from 'hooks/useAppRouter'

import './index.less'

const Swap = () => {
  const dispatch = useDispatch()
  const { askMint, bidMint, askAmount } = useSelector(
    (state: AppState) => state.swap,
  )
  const { pushHistory, getAllQuery } = useAppRouter()

  useEffect(() => {
    if (!askMint || !bidMint) return
    const { bid_mint, ask_mint } = getAllQuery<{
      bid_mint: string
      ask_mint: string
    }>()
    if (bidMint !== bid_mint || askMint !== ask_mint) {
      pushHistory(`/swap`, { bid_mint: bidMint, ask_mint: askMint }, false)
    }
  }, [askMint, bidMint, getAllQuery, pushHistory])

  const onSwitch = () => {
    dispatch(
      setSwapState({
        askMint: bidMint,
        bidMint: askMint,
        bidAmount: askAmount,
        askAmount: '',
        isReverse: false,
        loading: true,
      }),
    )
  }

  return (
    <Row gutter={[12, 12]} justify="center">
      <Col xs={24} md={14} lg={12} xl={8}>
        <Card style={{ boxShadow: 'unset' }}>
          <Row gutter={[0, 16]} justify="end">
            <Col>
              <SettingArea />
            </Col>
            <Col span={24}>
              <Row gutter={[0, 4]}>
                <Col span={24}>
                  <BidInput />
                </Col>
                <Col span={24}>
                  <Button
                    className="btn-switch-type"
                    size="small"
                    icon={<IonIcon name="git-compare-outline" />}
                    onClick={onSwitch}
                  />
                </Col>
                <Col span={24}>
                  <AskInput />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <SwapInfo />
            </Col>
            <Col span={24} />
            <Col span={24}>
              <ActionReview />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24} />
    </Row>
  )
}

export default Swap
