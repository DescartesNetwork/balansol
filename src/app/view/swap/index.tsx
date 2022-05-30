import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import AskInput from './askInput'
import BidInput from './bidInput'
import ActionReview from './reviewSwap'
import SettingArea from './settingArea'
import IonIcon from '@sentre/antd-ionicon'
import SwapInfo from 'app/components/swapInfo'

import { setSwapState } from 'app/model/swap.controller'
import { AppState } from 'app/model'
import { useAppRouter } from 'app/hooks/useAppRouter'

import './index.less'

const Swap = () => {
  const dispatch = useDispatch()

  const {
    swap: { askMint, bidMint, askAmount, bidAmount },
  } = useSelector((state: AppState) => state)
  const { pushHistory } = useAppRouter()

  useEffect(() => {
    if (!!askMint && !!bidMint)
      pushHistory(`/swap`, { bid_mint: bidMint, ask_mint: askMint }, false)
  }, [askMint, bidMint, pushHistory])

  const onSwitch = () => {
    dispatch(
      setSwapState({
        askMint: bidMint,
        bidMint: askMint,
        bidAmount: askAmount,
        askAmount: bidAmount,
        isReverse: false,
      }),
    )
  }

  return (
    <Row justify="center">
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
    </Row>
  )
}

export default Swap
