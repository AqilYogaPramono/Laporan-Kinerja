const connection = require('../config/db')

class DokumenKinerja {
    static async countDokumenKinerjaById(id) {
        try {
            const [rows] = await connection.query(`SELECT COUNT(dk.id) AS count_dokumen_kinerja FROM dokumen_kinerja dk WHERE dk.id_karyawan = ?`, [id])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getDokumenKinerjaById(id) {
        try {
            const [rows] = await connection.query(`select id, tipe_file, nama_file, file, dibuat_oleh, dibuat_pada, id_karyawan, id_laporan_kinerja from dokumen_kinerja where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getDokumenKinerjaByLaporanId(id_laporan_kinerja) {
        try {
            const [rows] = await connection.query(`select id, tipe_file, nama_file, file, dibuat_oleh, dibuat_pada, id_karyawan, id_laporan_kinerja from dokumen_kinerja where id_laporan_kinerja = ? ORDER BY dibuat_pada DESC`, [id_laporan_kinerja])
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

    static async checkAuthorDokumenKinerja(id_dokumen, id_karyawan) {
        try {
            const [rows] = await connection.query(`select id from dokumen_kinerja where id = ? and id_karyawan = ?`, [id_dokumen, id_karyawan])
            return rows.length > 0
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

    static async getDokumenKinerja() {
        try {
            const [rows] = await connection.query(`select id, tipe_file, nama_file, file, dibuat_oleh, dibuat_pada from dokumen_kinerja ORDER BY dibuat_pada DESC`, [])
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = DokumenKinerja