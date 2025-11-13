const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelManajer = require('../../models/Manajer')
const modelTim = require('../../models/Tim')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const {authAdmin} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)

        const [manajerProses] = await modelManajer.countManajerProses()
        const [manajerAktif] = await modelManajer.countManajerAktif()
        const [tim] = await modelTim.countTim()
        const [laporanKinerja] = await modelLaporanKinerja.countLaporanKinerja()

        res.render('admin/dashboard', { 
            admin,
            countManajerProses: (manajerProses && manajerProses.count_manajer_proses) || 0,
            countManajerAktif: (manajerAktif && manajerAktif.count_manajer_aktif) || 0,
            countTim: (tim && (tim.count_tim ?? tim.countTim)) || 0,
            countLaporanKinerja: (laporanKinerja && laporanKinerja.count_laporan_kinerja) || 0
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router