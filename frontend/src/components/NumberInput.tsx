import { Input, InputProps } from '@chakra-ui/react'

interface NumberInputProps extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Only allow positive numbers and decimals
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      variant="unstyled"
      fontSize="2xl"
      fontWeight="medium"
      placeholder="0.0"
      {...props}
    />
  )
}
