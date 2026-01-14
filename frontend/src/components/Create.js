import React, { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { useFieldArray } from 'react-hook-form'
import MyDatePickerField from '../forms/MyDatePickerField'
import MySelectField from '../forms/MySelectField'
import MyTextField from '../forms/MyTextField'

import AxiosInstance from './Axios'
import { generateSampleCode } from '../shared/sampleCode/generateSampleCode'

/* =======================
   VALIDATION SCHEMA
======================= */
const schema = yup.object({
  type: yup.string().required(),

  tank: yup.string().when('type', {
    is: 'raw_material',
    then: (s) => s.required('Tank wajib'),
  }),

  raw_material_type: yup.string().when('type', {
    is: 'raw_material',
    then: (s) => s.required('Jenis raw material wajib'),
    otherwise: (s) => s.notRequired(),
  }),

  pengisian_ke: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .when(['type', 'tank'], {
      is: (type, tank) =>
        type === 'raw_material' &&
        ['TA', 'TB', 'TC', 'TD', 'TE', 'TF'].includes(tank),
      then: (s) => s.required('Pengisian ke wajib'),
    }),

  tanggal_pengisian: yup.date().nullable().when('type', {
    is: 'raw_material',
    then: (s) => s.required('Tanggal pengisian wajib'),
  }),

  tanggal_produksi: yup.date().nullable().when('type', {
    is: (v) => ['fatblend', 'finished_product'].includes(v),
    then: (s) => s.required('Tanggal produksi wajib'),
  }),

  line: yup.string().when('type', {
    is: (v) => ['fatblend', 'finished_product'].includes(v),
    then: (s) => s.required(),
  }),

  nomor_urut: yup.number()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .when('type', {
      is: (v) => ['fatblend', 'finished_product'].includes(v),
      then: (s) => s.required('Nomor urut wajib'),
    }),

  raw_materials: yup.array().when('type', {
    is: 'fatblend',
    then: (schema) =>
      schema.min(1, 'Minimal 1 raw material')
        .of(
          yup.object({
            tank: yup.string().required('Tank wajib'),
            percentage: yup
              .number()
              .typeError('Isi angka')
              .transform((value, originalValue) => (originalValue === '' ? null : value))
              .min(1, 'Minimal 1%')
              .max(100, 'Max 100%')
              .required('Wajib isi persentase'),
          })
        ),
  }),
});

/* =======================
   DEFAULT VALUES
======================= */
const defaultValues = {
  type: '',
  name: '',

  tank: '',
  pengisian_ke: null,
  tanggal_pengisian: null,

  tanggal_produksi: null,
  line: '',
  nomor_urut: null,

  raw_materials: [],
  raw_material_type: '',
}



// comments: '',
// status: '',

/* =======================
   COMPONENT
======================= */
const Create = () => {
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const formValues = watch()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'raw_materials'
  })
  useEffect(() => {
    if (formValues.type === 'fatblend' && fields.length === 0) {
      append({ tank: '', percentage: '' })
    }
  }, [formValues.type, fields.length, append])



  /* =======================
     AUTO GENERATE CODE
  ======================= */
  useEffect(() => {
    const code = generateSampleCode(formValues.type, {
      tank: formValues.tank,
      pengisian_ke: formValues.pengisian_ke,
      tanggal_pengisian: formValues.tanggal_pengisian,
      tanggal_produksi: formValues.tanggal_produksi,
      line: formValues.line,
      nomor_urut: formValues.nomor_urut,
    })

    setValue('name', code)
  }, [
    formValues.type,
    formValues.tank,
    formValues.pengisian_ke,
    formValues.tanggal_pengisian,
    formValues.tanggal_produksi,
    formValues.line,
    formValues.nomor_urut,
    setValue,
  ])

  /* =======================
     SUBMIT
  ======================= */
  const onSubmit = (data) => {

    const payload = { ...data };
    payload.tanggal_pengisian = data.tanggal_pengisian
      ? dayjs(data.tanggal_pengisian).format('YYYY-MM-DD')
      : null

    payload.tanggal_produksi = data.tanggal_produksi
      ? dayjs(data.tanggal_produksi).format('YYYY-MM-DD')
      : null


    // RAW MATERIAL MODE
    if (data.type === 'raw_material') {
      delete payload.raw_materials;
    }

    // FATBLEND MODE
    if (data.type === 'fatblend') {
      // raw_material_type & raw material-only fields must be removed
      delete payload.raw_material_type;
      delete payload.tank;
      delete payload.pengisian_ke;
      delete payload.tanggal_pengisian;
    }

    // FINISHED PRODUCT MODE (raw_materials optional)
    if (data.type === 'finished_product') {
      delete payload.raw_material_type;
      delete payload.tank;
      delete payload.pengisian_ke;
      delete payload.tanggal_pengisian;

      // if array empty → remove it entirely
      if (!payload.raw_materials || payload.raw_materials.length === 0) {
        delete payload.raw_materials;
      }
    }


    AxiosInstance.post('project/', payload)
      .then(() => navigate('/', { state: { refresh: true } }))
      .catch(console.error)
  }

  /* =======================
     RENDER
  ======================= */
  const generateTankOptions = () => {
    const options = [];

    // TA - TF
    for (let i = 65; i <= 70; i++) {
      const tank = 'T' + String.fromCharCode(i);
      options.push({ value: tank, label: tank });
    }

    // J1 - J12 (kalau mau mulai J2, ganti 1 jadi 2)
    for (let i = 2; i <= 11; i++) {
      const tank = 'J' + i;
      options.push({ value: tank, label: tank });
    }

    return options;
  };

  return (
    <form onSubmit={handleSubmit(
      onSubmit,
      (err) => {
        console.log('🔥 VALIDATION ERRORS:', err)
      }
    )}>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-start' }}>
        {/* TYPE */}
        <MySelectField
          label="Type"
          name="type"
          control={control}
          width="30%"
          options={[
            { value: 'raw_material', label: 'Raw Material' },
            { value: 'fatblend', label: 'Fatblend' },
            { value: 'finished_product', label: 'Finished Product' },
          ]}
        />

        {/* RAW MATERIAL */}
        {formValues.type === 'raw_material' && (
          <>
            <MySelectField
              label="Jenis Raw Material"
              name="raw_material_type"
              control={control}
              width="30%"
              options={[
                { value: 'RBD_PO', label: 'RBD PO' },
                { value: 'Stearine_Hard', label: 'Stearine Hard' },
                { value: 'Stearine_Soft', label: 'Stearine Soft' },
              ]}
            />

            <MySelectField
              label="Tank"
              name="tank"
              control={control}
              width="30%"
              options={generateTankOptions()}
            />

            {formValues.tank?.startsWith('T') && (
              <MyTextField
                label="Pengisian ke"
                name="pengisian_ke"
                control={control}
                type="number"
                width="30%"
              />
            )}

            <MyDatePickerField label="Tanggal Pengisian" name="tanggal_pengisian" control={control} width="30%" />
          </>
        )}

        {/* FATBLEND & FINISHED */}
        {['fatblend', 'finished_product'].includes(formValues.type) && (
          <>
            <MyDatePickerField
              label="Tanggal Produksi"
              name="tanggal_produksi"
              control={control}
              width="30%"
            />

            <MySelectField
              label="Line"
              name="line"
              control={control}
              width="30%"
              options={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
                { value: 'D', label: 'D' },
                { value: 'E', label: 'E' },
                { value: 'W', label: 'W' },
                { value: 'Y', label: 'Y' },
                { value: 'Z', label: 'Z' },
              ]}
            />

            <MyTextField
              label="Nomor Urut"
              name="nomor_urut"
              control={control}
              type="number"
              width="30%"
            />
          </>
        )}
      </Box>

      {formValues.type === 'fatblend' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Raw Material Composition
          </Typography>

          {fields.map((item, index) => (
            <Box
              key={item.id}
              sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}
            >
              <MySelectField
                label="Tank"
                name={`raw_materials.${index}.tank`}
                control={control}
                width="25%"
                options={[
                  { value: 'TA', label: 'TA' },
                  { value: 'TB', label: 'TB' },
                  { value: 'TC', label: 'TC' },
                  { value: 'TD', label: 'TD' },
                  { value: 'TE', label: 'TE' },
                  { value: 'TF', label: 'TF' },
                ]}
              />

              <MyTextField
                label="%"
                name={`raw_materials.${index}.percentage`}
                control={control}
                type="number"
                width="25%"
              />

              <Button
                variant="outlined"
                color="error"
                onClick={() => remove(index)}
              >
                Hapus
              </Button>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={() => append({ tank: '', percentage: '' })}
          >
            + Tambah Raw Material
          </Button>
        </Box>
      )}


      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        <MyTextField
          label="Sample Code"
          name="name"
          control={control}
          disabled
          width="30%"
        />

        <Box sx={{ width: '30%' }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: '100%', height: '56px' }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default Create
