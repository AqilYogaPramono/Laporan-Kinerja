const connection = require('../config/db')

class LaporanKinerja {
    static async countLaporanKinerjaInOneTeamByUserId(id) {
        try {
            const [rows] = await connection.query(`SELECT COUNT(lk.id) AS count_laporan_kinerja FROM laporan_kinerja lk JOIN users u ON lk.id_user = u.id WHERE u.id_tim = (SELECT id_tim FROM users WHERE id = ?)`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countDokumenKinerjaByUserId(id) {
        try {
            const [rows] = await connection.query(`SELECT COUNT(dk.id) AS count_dokumen_kinerja FROM dokumen_kinerja dk WHERE dk.id_user = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getLaporanKinerja(id_user) {
        try {
            const [rows] = await connection.query(`SELECT l.id, l.judul_laporan, l.dibuat_oleh, l.dibuat_pada, l.terakhir_diedit_oleh, l.id_user, u.nama AS nama_user, u.id_tim FROM laporan_kinerja AS l JOIN users AS u ON l.id_user = u.id WHERE u.id_tim = ( SELECT id_tim FROM users WHERE id = ? ) ORDER BY l.terakhir_diedit_pada DESC`, [id_user])
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
            const [rows] = await connection.query(`select * from laporan_kinerja where id = ?`, [id])
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