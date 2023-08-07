import React from 'react';
import { useField } from 'formik';
import { isValid } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { KeyboardDatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import { hasValue } from './sutils';
import { dateTimeFormat } from '../../utils/dateHelpers';

interface IProps {
  name: string;
  variant?: 'outlined' | 'filled' | 'standard';
  pickerVariant?: 'inline' | 'dialog' | 'static';
}

type PickerProps = Omit<KeyboardDatePickerProps, 'variant' | 'inputVariant'>;

const XDateTimeInput = (props: IProps & Partial<PickerProps>) => {
  const { variant, pickerVariant, margin = 'normal', ...rest } = props;
  const [field, meta, helpers] = useField({ name: props.name });
  const error = hasValue(meta.error) ? meta.error : undefined;
  const showError = Boolean(error && meta.touched);

  function handleChange(date: MaterialUiPickersDate) {
    if (isValid(date)) {
      return helpers.setValue(date?.toISOString());
    }
    return helpers.setValue(null);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        {...rest}
        margin={margin}
        fullWidth
        variant={pickerVariant}
        format={dateTimeFormat}
        autoOk
        name={field.name}
        value={field.value || null}
        helperText={showError && error}
        error={Boolean(showError)}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        inputVariant={variant}
      />
    </MuiPickersUtilsProvider>
  );
};

export default XDateTimeInput;
