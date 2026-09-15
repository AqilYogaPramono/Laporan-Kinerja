const fs = require('fs')
const path = require('path')

const connection = require('../config/db')

async function runSeed() {
    const conn = await connection.getConnection()
    const copiedFiles = []
    try {
        const [tables] = await conn.query("SHOW TABLES LIKE 'admin'")
        if (tables.length > 0) {
            const [adminRows] = await conn.query("SELECT id FROM admin LIMIT 1")
            if (adminRows.length > 0) {
                console.log('Data seed dan dokumen sudah ditambahkan sebelumnya.')
                return
            }
        }

        const sqlPath = path.resolve(__dirname, 'db_laporan_kinerja_divisi.sql')
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')

        const sourceDir = path.resolve(__dirname, '../public/seed/laporanDokumen')
        const targetDir = path.resolve(__dirname, '../public/documents/laporanDokumen')
        const files = fs.readdirSync(sourceDir).filter(file => file !== '.gitkeep')

        await conn.beginTransaction()
        await conn.query(sqlContent)

        for (const file of files) {
            const sourcePath = path.join(sourceDir, file)
            const targetPath = path.join(targetDir, file)
            fs.copyFileSync(sourcePath, targetPath)
            copiedFiles.push(targetPath)
        }

        await conn.commit()
        console.log('Seeding database dan dokumen berhasil!')
    } catch (err) {
        await conn.rollback()
        for (const filePath of copiedFiles) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }
        console.error('Seeding gagal:', err)
    } finally {
        conn.release()
        process.exit()
    }
}

runSeed()
