const express = require('express')
const bcrypt = require('bcryptjs')

const modelAdmin = require('../models/Admin')
const modelUser = require('../models/User')
const modelTim = require('../models/Tim')

const router = express.Router()

router.get('/daftar', async (req, res) => {
    try {
        const tim = await modelTim.getAll()

        res.render('auth/register', {
            data: req.flash('data')[0],
            tim
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/daftar')
    }
})

router.post('/daftar', async (req, res) => {
    try {
        const { nama, nomor_pegawai, id_tim, kata_sandi, konfirmasi_kata_sandi } = req.body
        const data = { nama, nomor_pegawai, id_tim, kata_sandi }

        if (!nama) {
            req.flash('error', 'Nama wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!nomor_pegawai) {
            req.flash('error', 'Nomor Pegawai wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!id_tim) {
            req.flash('error', 'Tim wajib di pilih')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!kata_sandi) {
            req.flash('error', 'Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (await modelUser.checkNomorPegawai(data)) {
            req.flash('error', 'Nomor pegawai sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (kata_sandi.length < 6) {
            req.flash('error', 'Kata sandi minimal harus 6 karakter.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!/[A-Z]/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kapital.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!/[a-z]/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kecil.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (!/\d/.test(kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu angka.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        if (kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Kata sandi dan konfirmasi kata sandi tidak cocok.')
            req.flash('data', data)
            return res.redirect('/daftar')
        }

        await modelUser.register(data)

        req.flash('success', 'Pendaftaran berhasil, silahkan tunggu Admin mengaktivasi akun Anda.')
        return res.redirect('/')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/daftar')
    }
})

router.get('/', async (req, res) => {
    try {
        res.render('auth/login', {
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

router.post('/log', async (req, res) => {
    try {
        const { nomor_pegawai, kata_sandi } = req.body
        const data = { nomor_pegawai, kata_sandi }

        if (!nomor_pegawai) {
            req.flash('error', 'Nomor Pegawai wajib di isi')
            req.flash('data', data)
            return res.redirect('/')
        }

        if (!kata_sandi) {
            req.flash('error', 'kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/')
        }

        let user = null
        let role = null

        user = await modelUser.login(data)
        if (user) {
            role = user.jabatan
        } else {
            user = await modelAdmin.login(data)
            if (user) {
                role = "Admin"
            }
        }

        if (!user) {
            req.flash('error', 'Nomor Pegawai tidak terdaftar')
            req.flash('data', data)
            return res.redirect('/')
        }

        if (user.status !== 'Aktif' && role !== "Admin") {
            req.flash('error', 'Silahkan hubungi Admin untuk aktifasi akun anda.')
            req.flash('data', data)
            return res.redirect('/')
        }

        if (!(await bcrypt.compare(data.kata_sandi, user.kata_sandi))) {
            req.flash('error', 'Kata Sandi yang anda masukkan salah')
            req.flash('data', data)
            return res.redirect('/')
        }

        req.session.userId = user.id
        req.session.role = role

        if (req.session.role === "Ketua" || req.session.role === "Staf") return res.redirect('/user/dashboard')
        if (req.session.role === "Admin") return res.redirect('/admin/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (err) {
        console.log(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router