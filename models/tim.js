const connection = require('../config/db')

class tim {
    static async getAll() {
        try {
            const [rows] = await connection.query(`select * from tim`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query(`INSERT INTO tim SET ?`, [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async update(data, id) {
        try {
            const [result] = await connection.query(`UPDATE tim SET ? WHERE id = ?`, [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`SELECT * FROM tim WHERE id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query(`DELETE FROM tim WHERE id = ?`, [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkTimCreate(data) {
        try {
            const [rows] = await connection.query(`SELECT nama_tim FROM tim WHERE nama_tim = ?`, [data.nama_tim])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async checkTimUpdate(data, id) {
        try {
            const [rows] = await connection.query(`SELECT nama_tim FROM tim WHERE nama_tim = ? and id != ?`, [data.nama_tim, id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async checkTimUsed(id) {
        try {
            const [rows] = await connection.query(`SELECT id FROM karyawan WHERE id_tim = ? and from manajer where id_tim = ?`, [id, id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async countTim() {
        try {
            const [rows] = await connection.query(`SELECT count(id) as count_tim FROM tim`)
            return rows
        } catch (err) {
            throw err
        }
    }
}

module.exports = tim