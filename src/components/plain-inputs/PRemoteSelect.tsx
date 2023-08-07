import React, { ChangeEvent, useCallback, useEffect } from 'react';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { search } from '../../utils/ajax';
import { hasNoValue, IOption } from '../inputs/sutils';
import { ComboValue, PComboProps } from './PComboInput';

const filter = createFilterOptions<IOption | string>();

const FakeProgress = () => <div style={{ height: 20, width: 20 }}>&nbsp;</div>;

const filterIOptions = (options: (IOption | string)[], params: any) => {
  const filtered = filter(options, params) as IOption[];
  // Suggest the creation of a new value
  if (params.inputValue !== '') {
    filtered.push({
      id: params.inputValue,
      name: `Add "${params.inputValue}"`,
    });
  }
  return filtered;
};

export interface IPRemoteProps extends Omit<PComboProps, 'options'> {
  remote: string;
  filter?: any;
  searchOnline?: boolean;
  parser?: (d: any) => IOption | string;
  defaultIOptions?: IOption[] | string[];
  customOnChange?: (value: any) => void | undefined;
}

function hashCode(str: string): number {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    );
}

export function PRemoteSelect(props: IPRemoteProps) {
  const [loading, setLoading] = React.useState(false);
  const [options, setIOptions] = React.useState<IOption[] | string[]>(
    props.defaultIOptions || [],
  );
  const [query, setQuery] = React.useState<string>('');
  const [inputValue, setInputValue] = React.useState('');

  const [dataCache, setDataCache] = React.useState<any>({});

  const isInCache = useCallback(
    (filterParams: any) => {
      const key = hashCode(JSON.stringify(filterParams));
      if (dataCache[key]) {
        return dataCache[key];
      }
      return null;
    },
    [dataCache],
  );

  const addToCache = useCallback(
    (newFilter: any, resp: any) => {
      const key = hashCode(JSON.stringify(newFilter));
      const newData = { ...dataCache, [key]: resp };
      setDataCache(newData);
    },
    [dataCache],
  );
  const fetch = useCallback(
    (searchQuery: string) => {
      if (hasNoValue(props.remote)) {
        return;
      }
      const newFilter = { ...(props.filter || {}), searchQuery, limit: 300 };
      const cached = isInCache(newFilter);
      if (cached) {
        setIOptions(cached);
        return;
      }
      setLoading(true);
      search(
        props.remote,
        newFilter,
        (resp: any[] = []) => {
          if (!Array.isArray(resp)) {
            console.error('Invalid response for remote select', resp);
          } else if (props.parser) {
            const data: any[] = resp.map(props.parser);
            setIOptions(data);
            addToCache(newFilter, data);
          } else {
            setIOptions(resp);
            addToCache(newFilter, resp);
          }
        },
        undefined,
        () => {
          setLoading(false);
        },
      );
    },
    [props.parser, props.filter, props.remote, isInCache, addToCache],
  );

  useEffect(() => {
    fetch(query);
  }, [fetch, query]);
  const handleTouched = () => {
    props.onBlur?.();
    return undefined;
  };
  function handleChange(
    event: ChangeEvent<unknown>,
    value: ComboValue,
    _: any,
  ) {
    onChange(value);
  }

  function getIOptionSelection(o: IOption | string, v: IOption | string) {
    if (typeof o === 'string') {
      return o === v;
    }
    if (typeof o === 'object') {
      const obj = o as IOption;
      const val = v as IOption;
      return obj?.id === val?.id;
    }
    return false;
  }

  function getIOptionLabel(o: string | IOption) {
    if (typeof o === 'string') {
      return o;
    }
    if (typeof o === 'object') {
      const obj = o as IOption;
      return obj?.name;
    }
    return '';
  }

  const {
    onChange,
    onBlur,
    value,
    label,
    variant,
    multiple,
    helperText,
    showError,
    parser: i,
    defaultIOptions,
    searchOnline = true,
    margin = 'normal',
    freeSolo,
    textFieldProps,
    defaultValue,
    ...autoProps
  } = props;
  const Myvalue: any = value || (multiple ? [] : null);
  return (
    <Autocomplete
      {...autoProps}
      value={Myvalue}
      multiple={multiple}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        if (searchOnline) {
          setQuery(newInputValue);
        }
      }}
      getOptionLabel={getIOptionLabel}
      getOptionSelected={getIOptionSelection}
      filterOptions={
        props.searchOnline ? (x) => x : freeSolo ? filterIOptions : undefined
      }
      options={options}
      autoComplete
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          margin={margin}
          label={label}
          fullWidth
          onBlur={handleTouched}
          error={showError}
          helperText={showError && helperText}
          variant={props.variant}
          autoComplete="nope"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <FakeProgress />
                )}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
