const express = require('express')

const modelManajer = require('../../models/Manajer')
const bcrypt = require('bcryptjs')
const {authManajer} = require('../../middleware/auth')

const router = express.Router()

router.get('/ubah-kata-sandi', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)

        res.render('manajer/ubahKataSandi', { 
            manajer,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/dashboard')
    }
})

router.post('/change-password', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getById(req.session.userId)

        const {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru} = req.body
        const data = {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru}

        if (!kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!kata_sandi_baru) {
            req.flash('error', 'Kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!(await bcrypt.compare(kata_sandi, manajer.kata_sandi))) {
            req.flash('error', 'Kata sandi yang Anda inputkan salah')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (kata_sandi_baru.length < 6) {
            req.flash('error', 'Kata Sandi Minimal 6 karakter')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!/[A-Z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kapital')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!/[a-z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kecil')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (!/\d/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Angka')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        if (kata_sandi_baru != konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak sama')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        req.flash('success', 'Kata sandi berhasil diubah')
        await modelManajer.updatePassword(data, req.session.userId)
        res.redirect('/manajer/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/ubah-kata-sandi')
    }
})

module.exports = router