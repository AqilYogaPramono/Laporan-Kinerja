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
            userId: req.session.userId
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/user/dashboard')
    }
})

module.exports = router