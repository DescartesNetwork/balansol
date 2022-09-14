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

  const formatterNumber = (val: string | number | undefined) => {
    if (!val) return '0'
    let numberFormatted = `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const chars = numberFormatted.split('.')
    if (chars[1]) return `${chars[0]}.${chars[1].replace(/,/g, '')}`
    return chars[0]
  }

  const parserNumber = (val: string | undefined): number => {
    if (!val) return 0
    const chars = val.split('.')
    if (chars[1])
      return Number.parseFloat(
        `${chars[0].replace(/\D/g, '')}.${chars[1].replace(/\D/g, '')}`,
      )
    return Number.parseFloat(`${chars[0].replace(/\D/g, '')}`)
  }

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
      formatter={(val) => formatterNumber(val)}
      parser={parserNumber}
    />
  )
}

export default NumericInput
