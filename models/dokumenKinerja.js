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
}

module.exports = DokumenKinerja