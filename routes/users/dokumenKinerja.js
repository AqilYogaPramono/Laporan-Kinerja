const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const modelUser = require('../../models/User')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authUser} = require('../../middleware/auth')

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

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        if (ext === '.pdf' || file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            req.fileValidationError = 'Hanya file dengan format PDF (.pdf) yang diperbolehkan'
            cb(null, false)
        }
    }
})

const deleteUploadedFile = (filename) => {
    if (filename) {
        const filePath = path.join(__dirname, '../../public/documents/laporanDokumen', filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
}

router.get('/detail/:id', authUser, async (req, res) => {
    try {
        const {id} = req.params
        const user = await modelUser.getById(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)
        
        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        const checkIdTeamByUserId = await modelUser.getById(laporanKinerjaData.id_user)

        if (user.id_tim != checkIdTeamByUserId.id_tim) {
            req.flash('error', 'Anda tidak mendaptkan akses ke halaman ini.')
            return res.redirect('/user/laporan-kinerja')
        }

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaByLaporanId(id)

        res.render('user/dokumenKinerja/index', {
            user,
            laporanKinerjaData,
            dokumenKinerjaData,
            userId: req.session.userId,
            userRole: req.session.role
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja')
    }
})

router.get('/buat-dokumen/:id', authUser, async (req, res) => {
    try {
        const {id} = req.params
        const user = await modelUser.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        res.render('user/dokumenKinerja/buatDokumen', { 
            user,
            laporanKinerjaData,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja')
    }
})

router.post('/buat-dokumen/:id', authUser, upload.single('file'), async (req, res) => {
    try {
        const {id} = req.params
        const {nama_file} = req.body

        if (req.fileValidationError) {
            if (req.file) deleteUploadedFile(req.file.filename)
            req.flash('error', req.fileValidationError)
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-dokumen/${id}`)
        }

        if (!nama_file) {
            if (req.file) deleteUploadedFile(req.file.filename)
            req.flash('error', 'Nama file tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-dokumen/${id}`)
        }

        if (!req.file) {
            req.flash('error', 'File PDF tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-dokumen/${id}`)
        }

        const ext = path.extname(req.file.originalname).toLowerCase()
        if (ext !== '.pdf') {
            deleteUploadedFile(req.file.filename)
            req.flash('error', 'Hanya file dengan format PDF (.pdf) yang diperbolehkan')
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-dokumen/${id}`)
        }

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            deleteUploadedFile(req.file.filename)
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        const user = await modelUser.getById(req.session.userId)

        const data = {
            id_laporan_kinerja: id,
            tipe_file: 'Dokumen',
            nama_file,
            file: req.file.filename,
            dibuat_oleh: user.nama,
            id_user: user.id
        }

        await modelDokumenKinerja.store(data)

        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: user.nama
        }, id)

        req.flash('success', 'Dokumen kinerja berhasil dibuat')
        res.redirect(`/user/dokumen-kinerja/detail/${id}`)
    } catch (err) {
        console.error(err)
        if (req.file) deleteUploadedFile(req.file.filename)
        req.flash('error', 'Internal Server Error')
        res.redirect(`/user/dokumen-kinerja/buat-dokumen/${req.params.id}`)
    }
})

router.get('/buat-link/:id', authUser, async (req, res) => {
    try {
        const {id} = req.params
        const user = await modelUser.getNama(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        res.render('user/dokumenKinerja/buatLink', { 
            user,
            laporanKinerjaData,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja')
    }
})

router.post('/buat-link/:id', authUser, async (req, res) => {
    try {
        const {id} = req.params
        const {nama_file, file} = req.body

        if (!nama_file) {
            req.flash('error', 'Nama file tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-link/${id}`)
        }

        if (!file) {
            req.flash('error', 'Link tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect(`/user/dokumen-kinerja/buat-link/${id}`)
        }

        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)

        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        const user = await modelUser.getById(req.session.userId)

        const data = {
            id_laporan_kinerja: id,
            tipe_file: 'Link',
            nama_file,
            file,
            dibuat_oleh: user.nama,
            id_user: user.id
        }

        await modelDokumenKinerja.store(data)

        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: user.nama
        }, id)

        req.flash('success', 'Dokumen kinerja berhasil dibuat')
        res.redirect(`/user/dokumen-kinerja/detail/${id}`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect(`/user/dokumen-kinerja/buat-link/${req.params.id}`)
    }
})

router.post('/hapus/:id', authUser, async (req, res) => {
    try {
        const {id} = req.params

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaById(id)

        if (!dokumenKinerjaData) {
            req.flash('error', 'Dokumen kinerja tidak ditemukan')
            return res.redirect('/user/laporan-kinerja')
        }

        if (dokumenKinerjaData.id_user !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki akses untuk menghapus ini')
            return res.redirect(`/user/dokumen-kinerja/detail/${dokumenKinerjaData.id_laporan_kinerja}`)
        }

        if (dokumenKinerjaData.tipe_file === 'Dokumen') {
            deleteUploadedFile(dokumenKinerjaData.file)
        }

        await modelDokumenKinerja.delete(id)

        const user = await modelUser.getById(req.session.userId)
        await modelLaporanKinerja.lastUpdate({
            terakhir_diedit_oleh: user.nama
        }, dokumenKinerjaData.id_laporan_kinerja)

        req.flash('success', 'Dokumen kinerja berhasil dihapus')
        res.redirect(`/user/dokumen-kinerja/detail/${dokumenKinerjaData.id_laporan_kinerja}`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/laporan-kinerja')
    }
})

module.exports = router