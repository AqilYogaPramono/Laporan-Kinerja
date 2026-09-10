const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelUser = require('../../models/User')
const { authAdmin } = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)
        const data = await modelUser.getUsers()

        res.render('admin/users/users', { data, admin })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/verifikasi/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (status !== 'Aktif' && status !== 'Non-Aktif') {
            req.flash('error', 'Status tidak valid')
            return res.redirect('/admin/users')
        }

        const data = { status }
        if (status === 'Aktif') {
            data.waktu_diverifikasi = new Date()
        }

        await modelUser.updateStatusAccount(data, id)

        req.flash('success', 'Status Berhasil Diverifikasi')
        res.redirect('/admin/users')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users')
    }
})

module.exports = router