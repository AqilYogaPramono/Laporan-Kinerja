const connection = require('../config/db')

class Karyawan {
    static async checkNomorPegawai(data) {
        try {
            const [rows] = await connection.query(`select nomor_pegawai from karyawan where nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }
}

module.exports = Karyawan