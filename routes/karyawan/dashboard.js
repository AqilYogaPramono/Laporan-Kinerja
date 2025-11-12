const express = require('express')

const modelKaryawan = require('../../models/Karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authKaryawan} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const countLaporanKinerjaInOneTeamByIdData = await modelLaporanKinerja.countLaporanKinerjaInOneTeamById(req.session.userId)
        const countDokumenKinerjaByIdData = await modelDokumenKinerja.countDokumenKinerjaById(req.session.userId)

        res.render('karyawan/dashboard', { 
            karyawan, 
            countLaporanKinerjaInOneTeamById: countLaporanKinerjaInOneTeamByIdData[0].count_laporan_kinerja, 
            countDokumenKinerjaById: countDokumenKinerjaByIdData[0].count_dokumen_kinerja 
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router