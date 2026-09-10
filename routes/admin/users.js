const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelUser = require('../../models/User')
const modelTim = require('../../models/Tim')
const { authAdmin } = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)
        const data = await modelUser.getUsers()

        res.render('admin/users/users', { data, admin, searchKeyword: '' })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/search', authAdmin, async (req, res) => {
    try {
        const { nomor_pegawai } = req.body
        const admin = await modelAdmin.getNama(req.session.userId)
        const data = await modelUser.searchByNomorPegawai(nomor_pegawai)

        res.render('admin/users/users', { data, admin, searchKeyword: nomor_pegawai })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users')
    }
})

router.get('/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const admin = await modelAdmin.getNama(req.session.userId)
        const data = await modelUser.getById(id)
        const tim = await modelTim.getAll()

        if (!data) {
            req.flash('error', 'User tidak ditemukan')
            return res.redirect('/admin/users')
        }

        res.render('admin/users/detail', { data, admin, tim })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users')
    }
})

router.post('/verifikasi/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (status !== 'Aktif' && status !== 'Non-Aktif') {
            req.flash('error', 'Status tidak valid')
            return res.redirect('/admin/users/' + id)
        }

        const data = { status }
        if (status === 'Aktif') {
            data.waktu_diverifikasi = new Date()
        }

        await modelUser.updateStatusAccount(data, id)

        req.flash('success', 'Status Berhasil Diverifikasi')
        res.redirect('/admin/users/' + id)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users/')
    }
})

router.post('/jabatan/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { jabatan } = req.body

        if (jabatan !== 'Ketua' && jabatan !== 'Staf') {
            req.flash('error', 'Jabatan tidak valid')
            return res.redirect('/admin/users/' + id)
        }

        await modelUser.updateJabatan(id, jabatan)

        req.flash('success', `Jabatan Berhasil Diubah Menjadi ${jabatan}`)
        res.redirect('/admin/users/' + id)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users')
    }
})

router.post('/tim/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { id_tim } = req.body

        if (!id_tim) {
            req.flash('error', 'Tim wajib dipilih')
            return res.redirect('/admin/users/' + id)
        }

        await modelUser.updateTim(id, id_tim)

        req.flash('success', 'Tim Berhasil Diubah')
        res.redirect('/admin/users/' + id)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users/' + req.params.id)
    }
})

router.post('/delete/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const user = await modelUser.getById(id)

        if (!user) {
            req.flash('error', 'User tidak ditemukan')
            return res.redirect('/admin/users')
        }

        if (user.status !== 'Non-Aktif') {
            req.flash('error', 'Hanya akun berstatus Non-Aktif yang dapat dihapus')
            return res.redirect('/admin/users/' + id)
        }

        await modelUser.deleteUser(id)

        req.flash('success', 'Akun Berhasil Dihapus')
        res.redirect('/admin/users')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/users')
    }
})

module.exports = router