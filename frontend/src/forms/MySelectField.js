import * as React from 'react'
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from '@mui/material'
import { Controller } from 'react-hook-form'

const MySelectField = ({
  label,
  name,
  control,
  width = '100%',
  options = [],
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          variant="standard"
          sx={{ width }}
          error={!!fieldState.error}
        >
          <InputLabel>{label}</InputLabel>

          <Select
            {...field}
            value={field.value ?? ''}
            label={label}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>
            {fieldState.error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default MySelectField
