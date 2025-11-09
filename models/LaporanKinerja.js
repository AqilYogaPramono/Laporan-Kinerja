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

    static async getLaporanKinerja(id_karyawan) {
        try {
            const [rows] = await connection.query(`select id, judul_laporan, dibuat_oleh, dibuat_pada, terakhir_diedit_oleh, id_karyawan from laporan_kinerja where id_karyawan = ? ORDER BY terakhir_diedit_pada DESC`, [id_karyawan])
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

    static async getLaporanKinerjaById(id) {
        try {
            const [rows] = await connection.query(`select id, judul_laporan, dibuat_oleh, dibuat_pada, terakhir_diedit_pada, terakhir_diedit_oleh, id_karyawan from laporan_kinerja where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async update(data, id) {
        try {
            const [rows] = await connection.query(`update laporan_kinerja set ? where id = ?`, [data, id])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async checkAuthorLaporanKinerja(id_laporan, id_karyawan) {
        try {
            const [rows] = await connection.query(`select id from laporan_kinerja where id = ? and id_karyawan = ?`, [id_laporan, id_karyawan])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [rows] = await connection.query(`delete from laporan_kinerja where id = ?`, [id])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async lastUpdate(data, id) {
        try {
            const [rows] = await connection.query(`update laporan_kinerja set ? where id = ?`, [data, id])
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = LaporanKinerja