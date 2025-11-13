const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')

const {authAdmin} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)
        const data = await modelLaporanKinerja.getAllLaporanKinerja()

        res.render('admin/laporanKinerja/index', { 
            admin,
            data,
            userId: req.session.userId
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/detail/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const admin = await modelAdmin.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaByLaporanId(id)

        res.render('admin/laporanKinerja/detail', {
            admin,
            laporanKinerjaData,
            dokumenKinerjaData,
            userId: req.session.userId
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/laporan-kinerja')
    }
})

module.exports = router