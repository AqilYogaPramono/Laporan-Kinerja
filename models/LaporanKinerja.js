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

    static async countLaporanKinerjaInOneTeamById(id) {
        try {
            const [rows] = await connection.query(`SELECT COUNT(lk.id) AS count_laporan_kinerja FROM laporan_kinerja lk JOIN karyawan k ON lk.id_karyawan = k.id WHERE k.id_tim = ( SELECT id_tim FROM karyawan WHERE id = ?)`, [id])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getLaporanKinerja() {
        try {
            const [rows] = await connection.query(`select id, judul_laporan, dibuat_oleh, dibuat_pada, terakhir_diedit_oleh from laporan_kinerja ORDER BY terakhir_diedit_pada DESC`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [rows] = await connection.query(`insert into laporan_kinerja set ?`, [data])
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = LaporanKinerja