import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AxiosInstance from './Axios'

import {
    Box,
    TextField,
    Typography,
    Button,
    InputAdornment,
} from '@mui/material'

const Analyses = () => {
    const { id } = useParams()

    const [formData, setFormData] = useState({
        pv: '',
        ffa: '',
        color_r: '',
        color_y: '',
        color_b: '',
        sfc: '',
        iv: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        AxiosInstance.post('analysis/', {
            project: id,
            pv: parseFloat(formData.pv),
            ffa: parseFloat(formData.ffa),
            color_r: parseFloat(formData.color_r),
            color_y: parseFloat(formData.color_y),
            color_b: parseFloat(formData.color_b),
            sfc: parseFloat(formData.sfc),
            iv: parseFloat(formData.iv),
        })
            .then(() => {
                navigate(-1) // kembali ke halaman sebelumnya
            })
            .catch((error) => {
                console.error(error.response?.data || error)
            })
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Analyses – Project ID {id}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="PV"
                    name="pv"
                    type="number"
                    value={formData.pv}
                    onChange={handleChange}
                    slotProps={{
                        htmlInput: {
                            step: 'any',
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    meq O₂/kg
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    label="FFA"
                    name="ffa"
                    type="number"

                    value={formData.ffa}
                    onChange={handleChange}
                    slotProps={{
                        htmlInput: {
                            step: 'any',
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">%</InputAdornment>
                            ),
                        },
                    }}
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Color (Lovibond)
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Red (R)"
                        name="color_r"
                        type="number"

                        value={formData.color_r}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                step: 'any',
                            },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">R</InputAdornment>
                                ),
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Yellow (Y)"
                        name="color_y"
                        type="number"

                        value={formData.color_y}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                step: 'any',
                            },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">Y</InputAdornment>
                                ),
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Blue (B)"
                        name="color_b"
                        type="number"

                        value={formData.color_b}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                step: 'any',
                            },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">B</InputAdornment>
                                ),
                            },
                        }}
                        fullWidth
                    />
                </Box>

                <TextField
                    label="SFC"
                    name="sfc"
                    type="number"

                    value={formData.sfc}
                    onChange={handleChange}
                    slotProps={{
                        htmlInput: {
                            step: 'any',
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">%</InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    label="IV"
                    name="iv"
                    type="number"

                    value={formData.iv}
                    onChange={handleChange}
                    slotProps={{
                        htmlInput: {
                            step: 'any',
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    g I₂ / 100 g
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Save Analysis
                </Button>
            </Box>
        </Box>
    )
}

export default Analyses
