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
}

module.exports = User