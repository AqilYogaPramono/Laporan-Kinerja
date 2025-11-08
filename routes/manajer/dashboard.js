const express = require('express')

const modelKaryawan = require('../../models/Karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelManajer = require('../../models/Manajer')
const {authManajer} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)
        const countKaryawanProsesData = await modelKaryawan.countKaryawanProses()
        const countKaryawanValidData = await modelKaryawan.countKaryawanValid()
        const countDokumenLaporanData = await modelLaporanKinerja.countLaporanKinerja()

        res.render('manajer/dashboard', { manajer, countKaryawanProses: countKaryawanProsesData[0].count_karyawan_proses, countKaryawanValid: countKaryawanValidData[0].count_karyawan_proses, countDokumenLaporan: countDokumenLaporanData[0].count_laporan_kinerja })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/masuk')
    }
})

module.exports = router