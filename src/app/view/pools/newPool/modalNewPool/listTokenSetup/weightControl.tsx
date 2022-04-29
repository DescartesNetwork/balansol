import { Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import NumericInput from 'shared/antd/numericInput'
import { MintSetup } from '../index'

export default function WeightControl({
  tokenInfo,
  onChangeWeight,
  onChangeLock,
  onRemoveToken,
}: {
  tokenInfo: MintSetup
  onChangeWeight: (weight: string) => void
  onChangeLock: (isLocked: boolean) => void
  onRemoveToken: () => void
}) {
  const { weight, isLocked } = tokenInfo

  return (
    <Space size={4}>
      <NumericInput
        value={weight}
        size="large"
        bordered={false}
        onValue={onChangeWeight}
        suffix={'%'}
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
