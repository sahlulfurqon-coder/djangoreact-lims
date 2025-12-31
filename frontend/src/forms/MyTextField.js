import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'

export default function MyTextField(props) {
  const {
    label,
    width,
    placeholder,
    name,
    control,
    type = 'text',
    disabled = false,
  } = props

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          sx={{ width }}
          label={label}
          variant="standard"
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  )
}
