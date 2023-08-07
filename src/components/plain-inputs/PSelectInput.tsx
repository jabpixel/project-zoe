import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { IOption } from '../inputs/sutils';

interface IProps {
  onChange?: (event: React.ChangeEvent<{ value: unknown }>) => any;
  value?: any;
  label?: any;
  name?: any;
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
  helperText?: string;
  options: IOption[];
  multiple?: boolean;
}

const PSelectInput = ({
  name,
  multiple,
  helperText,
  size,
  options,
  variant,
  label,
  value,
  onChange,
}: IProps) => {
  const inputLabel = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);
  return (
    <FormControl variant={variant} fullWidth size={size}>
      <InputLabel ref={inputLabel}>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        labelWidth={variant === 'outlined' ? labelWidth : undefined}
        multiple={multiple}
        autoComplete="off"
      >
        {options.map((it) => (
          <MenuItem value={it.id} key={it.id}>
            {it.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
export default PSelectInput;
