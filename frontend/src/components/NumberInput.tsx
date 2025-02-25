import { Input, InputProps } from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { validateAndFormatAmount, formatDisplayAmount } from '../utils/validation'

interface NumberInputProps extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = validateAndFormatAmount(e.target.value)
    // Special handling for zero values
    if (newValue === '0' || newValue === '0.0' || newValue === '0.00') {
      newValue = '0'
    }
    onChange(newValue)
  }

  return (
    <Input
      type="text"
      value={formatDisplayAmount(value)}
      onChange={handleChange}
      variant="unstyled"
      fontSize="2xl"
      fontWeight="medium"
      color="black"
      placeholder="0.0"
      _placeholder={{ color: 'gray.700' }}
      pattern="^[0-9]*[.]?[0-9]*$"
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      {...props}
    />
  )
}
