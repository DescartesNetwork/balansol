import { Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import NumericInput from 'shared/antd/numericInput'
import { MintSetup } from '../index'

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
        size="large"
        bordered={false}
        onValue={onChangeWeight}
        suffix={<div style={{ marginLeft: -4 }}>%</div>}
        maxLength={5}
        style={{ textAlign: 'right' }}
        placeholder="0"
        className="input-weight"
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
