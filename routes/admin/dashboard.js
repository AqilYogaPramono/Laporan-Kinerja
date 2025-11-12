const express = require('express')

const modelManajer = require('../../models/Manajer')
const {authAdmin} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelManajer.getNama(req.session.userId)
        const countManajerProses = await modelManajer.countManajerProses()
        const countManajerAktif = await modelManajer.countManajerAktif()

        res.render('admin/dashboard', { admin, countManajerProses: countManajerProses[0].count_manajer_proses, countManajerAktif: countManajerAktif[0].count_manajer_proses })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router