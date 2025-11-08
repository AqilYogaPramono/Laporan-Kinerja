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
}

module.exports = tim