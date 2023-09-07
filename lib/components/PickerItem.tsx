import {
  HTMLProps,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { usePickerActions, usePickerData } from './Picker'
import { useColumnData } from './PickerColumn'

interface PickerItemRenderProps {
  selected: boolean
  focused: boolean
}

export interface PickerItemProps
  extends Omit<HTMLProps<HTMLDivElement>, 'value' | 'children'> {
  children: ReactNode | ((renderProps: PickerItemRenderProps) => ReactNode)
  value: string
}

// eslint-disable-next-line
function isFunction(functionToCheck: any): functionToCheck is Function {
  return typeof functionToCheck === 'function'
}

function PickerItem({ style, children, value, ...restProps }: PickerItemProps) {
  const optionRef = useRef<HTMLDivElement | null>(null)
  const {
    itemHeight,
    selectedItemHeight,
    value: pickerValue,
    focusedValue,
  } = usePickerData('Picker.Item')
  const pickerActions = usePickerActions('Picker.Item')
  const { key } = useColumnData('Picker.Item')

  useEffect(
    () => pickerActions.registerOption(key, { value, element: optionRef }),
    [key, pickerActions, value],
  )

  const isSelected = pickerValue[key] === value
  const isFocused = focusedValue[key] === value

  const itemStyle = useMemo(
    () => ({
      height: `${isSelected ? selectedItemHeight : itemHeight}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '10',
    }),
    [itemHeight, selectedItemHeight, isSelected],
  )

  const handleClick = useCallback(() => {
    pickerActions.change(key, value)
  }, [pickerActions, key, value])

  return (
    <div
      style={{
        ...itemStyle,
        ...style,
      }}
      ref={optionRef}
      onClick={handleClick}
      {...restProps}
    >
      {isFunction(children)
        ? children({ selected: isSelected, focused: isFocused })
        : children}
    </div>
  )
}

export default PickerItem
