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
