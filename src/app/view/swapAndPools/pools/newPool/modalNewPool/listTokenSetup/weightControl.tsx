import { Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { MintSetup } from '../index'
import NumericInput from 'app/components/numericInput'

export type WeightControlProps = {
  tokenInfo: MintSetup
  onChangeWeight: (weight: string) => void
  onChangeLock: (isLocked: boolean) => void
  onRemoveToken: () => void
}

const WeightControl = ({
  tokenInfo,
  onChangeWeight,
  onChangeLock,
  onRemoveToken,
}: WeightControlProps) => {
  const { weight, isLocked } = tokenInfo

  return (
    <Space size={4}>
      <NumericInput
        value={weight}
        controls={false}
        size="large"
        bordered={false}
        onValue={onChangeWeight}
        addonAfter={<div style={{ marginLeft: -4 }}>%</div>}
        maxLength={5}
        placeholder="0"
      />
      <Button
        onClick={() => {
          onChangeLock(!isLocked)
        }}
        shape="circle"
        icon={
          <IonIcon
            name={isLocked ? 'lock-closed-outline' : 'lock-open-outline'}
          />
        }
        style={{ background: 'unset' }}
        type="text"
      />
      <Button
        onClick={onRemoveToken}
        shape="circle"
        icon={<IonIcon name="trash-outline" />}
        type="text"
      />
    </Space>
  )
}

export default WeightControl
