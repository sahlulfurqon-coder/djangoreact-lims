import React, { useEffect, useMemo, useState } from 'react'
import AxiosInstance from './Axios'
import { MaterialReactTable } from 'material-react-table'
import dayjs from 'dayjs'
import { Box, IconButton, Chip } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const Home = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const fetchData = () => {
    AxiosInstance.get('project/')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [location.state])

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Sample Code',
        size: 180,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: [
          { text: 'Raw Material', value: 'raw_material' },
          { text: 'Fatblend', value: 'fatblend' },
          { text: 'Finished Product', value: 'finished_product' },
        ],
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            size="small"
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'raw_material_type',
        header: 'Raw Material Type',
        size: 180,
        Cell: ({ cell, row }) => {
          if (row.original.type !== 'raw_material') return '-';

          const value = cell.getValue();
          if (!value) return '-';

          // Tampilkan chip
          return (
            <Chip
              label={value}
              size="small"
              color="secondary"
              variant="outlined"
            />
          );
        },
      },
      {
        header: 'Raw Materials',
        accessorFn: (row) => row.raw_materials || [],
        Cell: ({ cell, row }) => {
          if (row.original.type !== 'fatblend') return '-';

          const materials = cell.getValue();
          if (!materials.length) return '-';

          return (
            <Box>
              {materials.map((rm, i) => (
                <Chip
                  key={i}
                  label={`${rm.tank} (${rm.percentage}%)`}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          );
        },
        size: 250,
      },
      {
        header: 'Tanggal',
        size: 160,
        accessorFn: (row) => {
          if (row.type === 'raw_material') {
            return row.tanggal_pengisian
              ? dayjs(row.tanggal_pengisian).format('DD-MM-YYYY')
              : '-'
          }

          return row.tanggal_produksi
            ? dayjs(row.tanggal_produksi).format('DD-MM-YYYY')
            : '-'
        },
      },
      {
        accessorKey: 'line',
        header: 'Line',
        size: 80,
        enableGrouping: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'nomor_urut',
        header: 'No',
        size: 80,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
      },
      {
        accessorKey: 'comments',
        header: 'Comments',
        size: 220,
      },
      {
        id: 'analyze',
        header: 'Analyze',
        size: 120,
        Cell: ({ row }) => (
          <Link
            to={`analyses/${row.original.id}`}
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 500,
            }}
          >
            Analyze
          </Link>
        ),
      },
    ],
    [],
  )

  return (
    <Box>
      {loading ? (
        <p>Loading data ...</p>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={data}
          enableGrouping
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="secondary"
                component={Link}
                to={`edit/${row.original.id}`}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                component={Link}
                to={`delete/${row.original.id}`}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      )}
    </Box>
  )
}

export default Home
