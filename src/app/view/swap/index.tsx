import React from 'react'

import { Button, Card, Col, Row } from 'antd'
import AskInput from './askInput'
import BidInput from './bidInput'
import ActionReview from './reviewSwap'
import SettingArea from './settingArea'
import IonIcon from 'shared/antd/ionicon'
import SwapInfo from 'app/components/swapInfo'

import { useDispatch, useSelector } from 'react-redux'
import { setSwapState } from 'app/model/swap.controller'
import { AppState } from 'app/model'
import { useRouteSwap } from 'app/hooks/useRouteSwap'

import './index.less'

export default function Swap() {
  const dispatch = useDispatch()

  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)

  const { askAmount } = useRouteSwap()

  const onSwitch = () => {
    dispatch(
      setSwapState({
        askMint: bidMint,
        bidMint: askMint,
        bidAmount: askAmount,
      }),
    )
  }

  return (
    <Row justify="center">
      <Col lg={8}>
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
                    icon={
                      <IonIcon
                        name="git-compare-outline"
                        style={{ color: 'white' }}
                      />
                    }
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