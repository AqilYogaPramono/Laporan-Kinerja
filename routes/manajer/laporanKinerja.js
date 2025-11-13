const express = require('express')

const modelManajer = require('../../models/Manajer')
const modelKaryawan = require('../../models/karyawan')
const modelLaporanKinerja = require('../../models/LaporanKinerja')
const modelDokumenKinerja = require('../../models/DokumenKinerja')
const {authManajer} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)
        const data = await modelLaporanKinerja.getLaporanKinerjaByIdManajer(req.session.userId)

        res.render('manajer/laporanKinerja/index', { 
            manajer,
            data,
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/dashboard')
    }
})

router.get('/detail/:id', authManajer, async (req, res) => {
    try {
        const {id} = req.params
        const manajer = await modelManajer.getById(req.session.userId)
        const laporanKinerjaData = await modelLaporanKinerja.getLaporanKinerjaById(id)
        const checkIdTim = await modelKaryawan.getById(laporanKinerjaData.id_karyawan)
        
        if (!laporanKinerjaData) {
            req.flash('error', 'Laporan kinerja tidak ditemukan')
            return res.redirect('/manajer/laporan-kinerja')
        }

        if (manajer.id_tim != checkIdTim.id_tim) {
            req.flash('error', 'Anda tidak mendaptkan akses ke halaman ini.')
            return res.redirect('/manajer/laporan-kinerja')
        }

        const dokumenKinerjaData = await modelDokumenKinerja.getDokumenKinerjaByLaporanId(id)

        res.render('manajer/laporanKinerja/detail', {
            manajer,
            laporanKinerjaData,
            dokumenKinerjaData,
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/laporan-kinerja')
    }
})

module.exports = router