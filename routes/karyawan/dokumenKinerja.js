const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const modelKaryawan = require('../../models/Karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authKaryawan} = require('../../middleware/auth')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/documents/laporanDokumen'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage})

const deleteUploadedFile = (filename) => {
    if (filename) {
        const filePath = path.join(__dirname, '../../public/documents/laporanDokumen', filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
}

router.get('/buat-dokumen/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        res.render('karyawan/dokumenKinerja/buatDokumen', { 
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

router.post('/buat-dokumen/:id', authKaryawan, upload.single('file'), async (req, res) => {
    try {
        const {id} = req.params
        const {nama_file} = req.body

        if (!nama_file) {
            deleteUploadedFile(req.file ? req.file.filename : null)
            req.flash('error', 'Nama file tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/karyawan/dokumen-kinerja/buat-dokumen/${id}`)
        }

        if (!req.file) {
            req.flash('error', 'File tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/karyawan/dokumen-kinerja/buat-dokumen/${id}`)
        }

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            deleteUploadedFile(req.file.filename)
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        const karyawan = await modelKaryawan.getById(req.session.userId)

        const data = {
            id_laporan_kinerja: id,
            tipe_file: 'Dokumen',
            nama_file,
            file: req.file.filename,
            dibuat_oleh: karyawan.nama,
            id_karyawan: karyawan.id
        }

        await modelDokumenKinerja.store(data)

        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: karyawan.nama
        }, id)

        req.flash('success', 'Dokumen kinerja berhasil dibuat')
        res.redirect(`/karyawan/laporan-kinerja/detail/${id}`)
    } catch (err) {
        console.error(err)
        if (req.file) deleteUploadedFile(req.file.filename)
        req.flash('error', 'Internal Server Error')
        res.redirect(`/karyawan/dokumen-kinerja/buat-dokumen/${req.params.id}`)
    }
})

router.get('/buat-link/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const karyawan = await modelKaryawan.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        res.render('karyawan/dokumenKinerja/buatLink', { 
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

router.post('/buat-link/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params
        const {nama_file, file} = req.body

        if (!nama_file) {
            req.flash('error', 'Nama file tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/karyawan/dokumen-kinerja/buat-link/${id}`)
        }

        if (!file) {
            req.flash('error', 'Link tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/karyawan/dokumen-kinerja/buat-link/${id}`)
        }

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        const karyawan = await modelKaryawan.getById(req.session.userId)

        const data = {
            id_laporan_kinerja: id,
            tipe_file: 'Link',
            nama_file,
            file,
            dibuat_oleh: karyawan.nama,
            id_karyawan: karyawan.id
        }

        await modelDokumenKinerja.store(data)

        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: karyawan.nama
        }, id)

        req.flash('success', 'Dokumen kinerja berhasil dibuat')
        res.redirect(`/karyawan/laporan-kinerja/detail/${id}`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect(`/karyawan/dokumen-kinerja/buat-link/${req.params.id}`)
    }
})

router.post('/hapus/:id', authKaryawan, async (req, res) => {
    try {
        const {id} = req.params

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaById(id)

        if (!dokumenKinerjaData) {
            req.flash('error', 'Dokumen kinerja tidak ditemukan')
            return res.redirect('/karyawan/laporan-kinerja')
        }

        if (dokumenKinerjaData.id_karyawan !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki akses untuk menghapus ini')
            return res.redirect(`/karyawan/laporan-kinerja/detail/${dokumenKinerjaData.id_laporan_kinerja}`)
        }

        if (dokumenKinerjaData.tipe_file === 'Dokumen') {
            deleteUploadedFile(dokumenKinerjaData.file)
        }

        await modelDokumenKinerja.delete(id)

        const karyawan = await modelKaryawan.getById(req.session.userId)
        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: karyawan.nama
        }, dokumenKinerjaData.id_laporan_kinerja)

        req.flash('success', 'Dokumen kinerja berhasil dihapus')
        res.redirect(`/karyawan/laporan-kinerja/detail/${dokumenKinerjaData.id_laporan_kinerja}`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/laporan-kinerja')
    }
})

module.exports = router