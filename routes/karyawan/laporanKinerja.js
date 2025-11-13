const express = require('express')

const modelKaryawan = require('../../models/Karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authKaryawan} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const data = await modelLaporanKinerja.getLaporanKinerja(req.session.userId)

        res.render('karyawan/laporanKinerja/index', { 
            karyawan,
            data,
            userId: req.session.userId
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

router.get('/detail/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const karyawan = await modelKaryawan.getById(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)
        const checkIdTeamByIdKaryawan = await modelKaryawan.getById(laporanKinerjaData.id_karyawan)
        
        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        if (karyawan.id_tim != checkIdTeamByIdKaryawan.id_tim) {
            req.flash('error', 'Anda tidak mendaptkan akses ke halaman ini.')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaByLaporanId(id)

        res.render('karyawan/laporanKinerja/detail', {
            karyawan,
            laporanKinerjaData,
            dokumenKinerjaData,
            userId: req.session.userId
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

router.get('/edit/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        if (laporanKinerjaData.id_karyawan !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki akses untuk mengedit ini')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        res.render('karyawan/laporanKinerja/edit', {
            karyawan,
            laporanKinerjaData,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

router.post('/edit/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const {judul_laporan} = req.body

        if (!judul_laporan) {
            req.flash('error', 'Judul laporan tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/karyawan/laporan-kinerja/edit/${id}`)
        }

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        if (laporanKinerjaData.id_karyawan !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki akses untuk mengedit ini')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        const karyawan = await modelKaryawan.getById(req.session.userId)

        const data = {
            judul_laporan,
            terakhir_diedit_oleh: karyawan.nama
        }

        await modelLaporanKinerja.update(data, id)
        req.flash('success', 'Laporan kinerja berhasil diubah')
        res.redirect(`/karyawan/laporan-kinerja`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

router.post('/hapus/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        if (laporanKinerjaData.id_karyawan !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki akses untuk menghapus ini')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        await modelLaporanKinerja.delete(id)
        req.flash('success', 'Laporan kinerja berhasil dihapus')
        res.redirect('/karyawan/laporan-kinerja')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

module.exports = router