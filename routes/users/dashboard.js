const express = require('express')

const modelUser = require('../../models/User')
const modelLaporanKinerja = require('../../models/LaporanKinerja')

const {authUser} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authUser, async (req, res) => {
    try {
        const user = await modelUser.getNama(req.session.userId)
        const laporanData = await modelLaporanKinerja.countLaporanKinerjaInOneTeamByUserId(req.session.userId)
        const dokumenData = await modelLaporanKinerja.countDokumenKinerjaByUserId(req.session.userId)

        const countLaporanKinerjaInOneTeamById = laporanData ? laporanData.count_laporan_kinerja : 0
        const countDokumenKinerjaById = dokumenData ? dokumenData.count_dokumen_kinerja : 0

        res.render('user/dashboard', { 
            user, 
            countLaporanKinerjaInOneTeamById,
            countDokumenKinerjaById
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router