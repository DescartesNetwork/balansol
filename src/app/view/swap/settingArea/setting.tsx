import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Space, Typography } from 'antd'

import { setSwapState } from 'app/model/swap.controller'
import { AppState } from 'app/model'

const slippageOptions = [0.5, 1, 2, 100]

const Setting = () => {
  const slippageTolerance = useSelector(
    (state: AppState) => state.swap.slippageTolerance,
  )
  const dispatch = useDispatch()

  const onChange = (value: number) => {
    dispatch(
      setSwapState({
        slippageTolerance: value,
      }),
    )
  }

  return (
    <Card
      bodyStyle={{
        padding: 16,
      }}
      style={{ boxShadow: 'none' }}
    >
      <Space size={24} direction="vertical">
        <Typography.Title level={5}>Slippage tolerance</Typography.Title>
        <Space size={12}>
          {slippageOptions.map((value) => {
            const slippageSelected =
              value === slippageTolerance ? 'selected' : ''
            return (
              <Button
                className={`btn-slippage ${slippageSelected}`}
                onClick={() => {
                  onChange(value)
                }}
                key={value}
              >
                {value === 100 ? 'Freely' : `${value}%`}
              </Button>
            )
          })}
        </Space>
      </Space>
    </Card>
  )
}

export default Setting
