const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelUser = require('../../models/User')
const modelTim = require('../../models/Tim')
const {authAdmin} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)

        const userProsesData = await modelUser.countUserProses()
        const userAktifData = await modelUser.countUserAktif()
        const timData = await modelTim.countTim()

        const countUserProses = userProsesData ? userProsesData.count_user_proses : 0
        const countUserAktif = userAktifData ? userAktifData.count_user_aktif : 0
        const countTim = Array.isArray(timData) ? (timData[0] ? timData[0].count_tim : 0) : (timData ? timData.count_tim : 0)

        res.render('admin/dashboard', { 
            admin,
            countUserProses,
            countUserAktif,
            countTim
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router