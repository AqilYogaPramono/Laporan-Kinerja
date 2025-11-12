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

    static async countKaryawanProses() {
        try {
            const [rows] = await connection.query(`select count(id) as count_karyawan_proses from karyawan where status = 'Proses'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async countKaryawanValid() {
        try {
            const [rows] = await connection.query(`select count(id) as count_karyawan_valid from karyawan where status = 'Aktif'`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getKaryawan() {
        try {
            const [rows] = await connection.query(`select id, foto_profil, nama, nomor_pegawai, nomor_whatsapp, status, waktu_dibuat, waktu_diverifikasi from karyawan  ORDER BY waktu_dibuat DESC`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async updateStatusAccount(data, id) {
        try {
            const [result] = await connection.query('UPDATE karyawan SET status = ?, waktu_diverifikasi = NOW() WHERE id = ?',[data.status, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`select * from karyawan where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async deleteAccount(id) {
        try {
            const [result] = await connection.query('DELETE FROM karyawan WHERE id = ?',[id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getNama(id) {
        try {
            const [rows] = await connection.query(`select nama from karyawan where id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async updatePassword(data, id) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi_baru, 10)
            const [result] = await connection.query('UPDATE karyawan SET kata_sandi = ? WHERE id = ?',[hashedPassword, id])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Karyawan