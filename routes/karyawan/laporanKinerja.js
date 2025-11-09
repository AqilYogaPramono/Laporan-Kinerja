const express = require('express')

const modelKaryawan = require('../../models/Karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const {authKaryawan} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const data = await modelLaporanKinerja.getLaporanKinerja()

        res.render('karyawan/laporanKinerja/index', { 
            karyawan,
            data
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/dashboard')
    }
})

router.get('/buat', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getNama(req.session.userId)

        res.render('karyawan/laporanKinerja/buat', { 
            karyawan,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

router.post('/buat', authKaryawan, async (req, res) => {
    try {
        const {judul_laporan} = req.body

        if (!judul_laporan) {
            req.flash('error', 'Judul laporan tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/karyawan/laporan-kinerja/buat')
        }

        const karyawan = await modelKaryawan.getById(req.session.userId)

        const data = {
            judul_laporan,
            dibuat_oleh: karyawan.nama,
            id_karyawan: karyawan.id
        }

        await modelLaporanKinerja.store(data)
        req.flash('success', 'Laporan kinerja berhasil dibuat')
        res.redirect('/karyawan/laporan-kinerja')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja/buat')
    }
})


module.exports = router