const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class Karyawan {
    static async checkNomorPegawai(data) {
        try {
            const [rows] = await connection.query(`select nomor_pegawai from karyawan where nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async checkNoWa(data) {
        try {
            const [rows] = await connection.query(`select nomor_whatsapp from karyawan where nomor_whatsapp = ?`, [data.nomor_whatsapp])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async register(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi, 10)
            const [result] = await connection.query(`INSERT INTO karyawan set ?`, { nama: data.nama, foto_profil: data.foto_profil, nomor_pegawai: data.nomor_pegawai, nomor_whatsapp: data.nomor_whatsapp, id_tim: data.id_tim, kata_sandi: hashedPassword})
            return result
        } catch (err) {
            throw err
        }
    }

    static async login(data) {
        try {
            const [rows] = await connection.query(`select * from karyawan where nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows[0]
        } catch (err) {
            throw err
        }
    }
}

module.exports = Karyawan