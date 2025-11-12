const connection = require('../config/db')
const bcrypt = require('bcryptjs')

class Manajer {
    static async checkNomorPegawai(data) {
        try {
            const [rows] = await connection.query(`select nomor_pegawai from manajer where nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async register(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi, 10)
            const [result] = await connection.query('INSERT INTO manajer set ?', { nama: data.nama, nomor_pegawai: data.nomor_pegawai, kata_sandi: hashedPassword})
            return result
        } catch (err) {
            throw err
        }
    }

    static async login(data) {
        try {
            const [rows] = await connection.query(`select * from manajer where nomor_pegawai = ?`, [data.nomor_pegawai])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getNama(id) {
        try {
            const [rows] = await connection.query(`select nama from manajer where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countManajerProses() {
        try {
            const [rows] = await connection.query(`select count(id) as count_manajer_proses from manajer where tingkat = 'Manajer' and status = 'Proses'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async countManajerAktif() {
        try {
            const [rows] = await connection.query(`select count(id) as count_manajer_proses from manajer where tingkat = 'Manajer' and status = 'Aktif'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getManajer() {
        try {
            const [rows] = await connection.query(`select id, nama, nomor_pegawai, status, waktu_dibuat, waktu_diverifikasi from manajer where tingkat = 'Manajer'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async updateStatusAccount(data, id) {
        try {
            const [result] = await connection.query('UPDATE manajer SET status = ?, waktu_diverifikasi = NOW() WHERE id = ?',[data.status, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`select * from manajer where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async deleteAccount(id) {
        try {
            const [result] = await connection.query('DELETE FROM manajer WHERE id = ?',[id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async updatePassword(data, idPengguna) {
        try {
            const kata_sandi_hash = await bcrypt.hash(data.kata_sandi_baru, 10)
            const dataUpdate = { kata_sandi: kata_sandi_hash }

            const [result] = await connection.query('UPDATE manajer SET ? WHERE id = ?',[dataUpdate, idPengguna])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Manajer