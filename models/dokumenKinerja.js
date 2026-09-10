const connection = require('../config/db')

class DokumenKinerja {
    static async getDokumenKinerjaById(id) {
        try {
            const [rows] = await connection.query(`select id, nama_file, file, dibuat_oleh, dibuat_pada, id_user, id_laporan_kinerja from dokumen_kinerja where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getDokumenKinerjaByLaporanId(id_laporan_kinerja) {
        try {
            const [rows] = await connection.query(`select id, nama_file, file, dibuat_oleh, dibuat_pada, id_user, id_laporan_kinerja from dokumen_kinerja where id_laporan_kinerja = ? ORDER BY dibuat_pada DESC`, [id_laporan_kinerja])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [rows] = await connection.query(`insert into dokumen_kinerja set ?`, [data])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [rows] = await connection.query(`delete from dokumen_kinerja where id = ?`, [id])
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = DokumenKinerja
