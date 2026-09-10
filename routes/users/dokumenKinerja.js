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

const upload = multer({storage})

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

module.exports = router