import { type FC, type ChangeEvent } from 'react';
import { Input, type InputProps } from '@chakra-ui/react';

interface NumberInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const NumberInput: FC<NumberInputProps> = ({ value, onChange, ...props }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (/^\d*\.?\d*$/.test(val) && Number(val) >= 0)) {
      onChange(val);
    }
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};
