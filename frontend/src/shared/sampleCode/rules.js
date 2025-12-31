import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

const TANK_HURUF = ['TA','TB','TC','TD','TE','TF']

export const RULES = {

  raw_material: {
    required: ['tank', 'tanggal_pengisian'],

    generate: ({ tank, pengisian_ke, tanggal_pengisian }) => {
      if (!tank || !tanggal_pengisian) return ''

      const dateCode = dayjs(tanggal_pengisian).format('DDMMYY')

      if (TANK_HURUF.includes(tank)) {
        if (!pengisian_ke) return ''
        return `${tank} ${pengisian_ke}${dateCode}`
      }

      if (tank.startsWith('J')) {
        return `${tank} ${dateCode}`
      }

      return ''
    }
  },

  fatblend: {
    required: ['tanggal_produksi', 'line', 'nomor_urut'],

    generate: ({ tanggal_produksi, line, nomor_urut }) => {
      if (!tanggal_produksi || !line || !nomor_urut) return ''

      const d = dayjs(tanggal_produksi)

      return `${d.isoWeekday()}${d.isoWeek()}${d.format('YY')}${line}-${nomor_urut}`
    }
  },

  finished_product: {
    required: ['tanggal_produksi', 'line', 'nomor_urut'],

    generate: ({ tanggal_produksi, line, nomor_urut }) => {
      if (!tanggal_produksi || !line || !nomor_urut) return ''

      const d = dayjs(tanggal_produksi)

      return `${d.isoWeekday()}${d.isoWeek()}${d.format('YY')}${line}-${nomor_urut}`
    }
  },

}
