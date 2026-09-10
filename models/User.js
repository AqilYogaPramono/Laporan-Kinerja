const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class User {
    static async login(data) {
        try {
            const [rows] = await connection.query(`SELECT * FROM users WHERE nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countUserProses() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as count_user_proses FROM users WHERE status = 'Proses'`)
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countUserAktif() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(id) as count_user_aktif FROM users WHERE status = 'Aktif'`)
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getNama(id) {
        try {
            const [rows] = await connection.query(`SELECT nama FROM users WHERE id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async checkNomorPegawai(data) {
        try {
            const [rows] = await connection.query(`SELECT nomor_pegawai FROM users WHERE nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async register(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi, 10)
            const [result] = await connection.query(`INSERT INTO users SET ?`, {
                nama: data.nama,
                nomor_pegawai: data.nomor_pegawai,
                id_tim: data.id_tim,
                kata_sandi: hashedPassword
            })
            return result
        } catch (err) {
            throw err
        }
    }

    static async getUsers() {
        try {
            const [rows] = await connection.query(`SELECT u.id, u.nama, u.nomor_pegawai, u.jabatan, u.id_tim, u.status, u.waktu_dibuat, u.waktu_diverifikasi, t.nama_tim FROM users u LEFT JOIN tim t ON u.id_tim = t.id ORDER BY u.waktu_dibuat DESC`)
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = User