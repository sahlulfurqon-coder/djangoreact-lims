import * as React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller } from 'react-hook-form'

export default function MyDatePickerField(props) {
  const { label, control, width, name } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value || null}
          onChange={field.onChange}
          formState
          sx={{ width }}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  )
}
