const express = require('express')

const modelManajer = require('../models/Manajer')
const modelKarywan = require('../models/Karyawan')

const router = express.Router()

router.get('/daftar-manajer', async (req, res) => {
    try {
        res.render('auth/registerManajer', {
            data: req.flash('data')[0],
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

router.post('/reg-manajer', async (req, res) => {
    try {
        const { nama, nomor_pegawai, kata_sandi, konfirmasi_kata_sandi } = req.body
        const data = { nama, nomor_pegawai, kata_sandi }

        if (!nama) {
            req.flash('error', 'Nama wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!nomor_pegawai) {
            req.flash('error', 'Nomor Pegawai wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!kata_sandi) {
            req.flash('error', 'Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (await modelKarywan.checkNomorPegawai(data)) {
            req.flash('error', 'Nomor pegawai sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (await modelManajer.checkNomorPegawai(data)) {
            req.flash('error', 'Nomor pegawai sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (kata_sandi.length < 6) {
            req.flash('error', 'Kata sandi minimal harus 6 karakter.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!/[A-Z]/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kapital.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!/[a-z]/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kecil.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (!/\d/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu angka.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        if (kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Kata sandi dan konfirmasi kata sandi tidak cocok.')
            req.flash('data', data)
            return res.redirect('/daftar-manajer')
        }

        await modelManajer.register(data)

        req.flash('success', 'Pendaftaran berhasil, silahkan tunggu Admin mengaktivasi akun Anda.')
        return res.redirect('/daftar-manajer')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})


module.exports = router