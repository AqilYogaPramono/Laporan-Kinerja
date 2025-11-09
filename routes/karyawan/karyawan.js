const express = require('express')

const modelKaryawan = require('../../models/Karyawan')
const {authKaryawan} = require('../../middleware/auth')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.get('/ubah-kata-sandi', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getNama(req.session.userId)

        res.render('karyawan/ubahKataSandi', { 
            karyawan,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/dashboard')
    }
})

router.post('/change-password', authKaryawan, async (req, res) => {
    try {
        const karyawan = await modelKaryawan.getById(req.session.userId)

        const {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru} = req.body
        const data = {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru}

        if (!kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!kata_sandi_baru) {
            req.flash('error', 'Kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!(await bcrypt.compare(kata_sandi, karyawan.kata_sandi))) {
            req.flash('error', 'Kata sandi yang Anda inputkan salah')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (kata_sandi_baru.length < 6) {
            req.flash('error', 'Kata Sandi Minimal 6 karakter')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!/[A-Z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kapital')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!/[a-z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kecil')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (!/\d/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Angka')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        if (kata_sandi_baru != konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak sama')
            req.flash('data', req.body)
            return res.redirect('/karyawan/ubah-kata-sandi')
        }

        req.flash('success', 'Kata sandi berhasil diubah')
        await modelKaryawan.updatePassword(data, req.session.userId)
        res.redirect('/karyawan/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/karyawan/ubah-kata-sandi')
    }
})


module.exports = router