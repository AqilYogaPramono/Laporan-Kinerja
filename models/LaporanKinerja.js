const connection = require('../config/db')

class LaporanKinerja {
    static async countLaporanKinerja() {
        try {
            const [rows] = await connection.query(`select count(id) as count_laporan_kinerja from laporan_kinerja`)
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = LaporanKinerja