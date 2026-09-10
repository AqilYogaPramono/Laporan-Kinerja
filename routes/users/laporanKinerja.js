const express = require('express')

const modelUser = require('../../models/User')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authUser} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authUser, async (req, res) => {
    try {
        const user = await modelUser.getNama(req.session.userId)
        const data = await modelLaporanKinerja.getLaporanKinerja(req.session.userId)

        res.render('user/laporanKinerja/index', { 
            user,
            data,
            userId: req.session.userId,
            userRole: req.session.role
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/dashboard')
    }
})

router.get('/buat', authUser, async (req, res) => {
    try {
        if (req.session.role !== 'Ketua') {
            req.flash('error', 'Anda tidak memiliki akses ke halaman ini')
            return res.redirect('/user/laporan-kinerja')
        }

        const user = await modelUser.getNama(req.session.userId)

        res.render('user/laporanKinerja/buat', { 
            user,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja')
    }
})

router.post('/buat', authUser, async (req, res) => {
    try {
        const {judul_laporan} = req.body

        if (!judul_laporan) {
            req.flash('error', 'Judul laporan tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/user/laporan-kinerja/buat')
        }

        const user = await modelUser.getById(req.session.userId)

        const data = {
            judul_laporan,
            dibuat_oleh: user.nama,
            id_user: user.id
        }

        await modelLaporanKinerja.store(data)
        req.flash('success', 'Laporan kinerja berhasil dibuat')
        res.redirect('/user/laporan-kinerja')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja/buat')
    }
})

module.exports = router