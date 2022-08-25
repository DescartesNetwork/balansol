import { useCallback, CSSProperties } from 'react'

import { InputNumberProps, InputNumber } from 'antd'

import './index.less'

export enum InputStyle {
  InputRight = 'input-right',
  InputLeft = 'input-left',
  InputCenter = 'input-center',
}

const NumericInput = ({
  max,
  onValue = () => {},
  inputStyle = InputStyle.InputRight,
  styles,
  ...props
}: InputNumberProps & {
  onValue?: (val: string) => void
  inputStyle?: InputStyle
  styles?: CSSProperties
  max?: string | number
}) => {
  // Handle amount
  const onAmount = useCallback(
    (val: string | number | string) => {
      if (
        val === null ||
        (max && parseFloat(val.toString()) > parseFloat(max.toString()))
      )
        return onValue('')

      onValue(val.toString())
    },
    [max, onValue],
  )

  return (
    <InputNumber
      {...props}
      stringMode
      onChange={onAmount}
      className={`${inputStyle}`}
      style={{ width: '100%', fontSize: 24, ...styles }}
      onBlur={(e) => {
        if (!e.target.value) {
          onAmount('0')
        }
      }}
      decimalSeparator="."
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
    />
  )
}

export default NumericInput
