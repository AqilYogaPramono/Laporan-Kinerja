const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const modelManajer = require('../models/Manajer')
const modelKarywan = require('../models/Karyawan')
const modelTim = require('../models/tim')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/marketers'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage})

const deleteUploadedFile = (file) => {
    if (file && file.filename) {
        const filePath = path.join(__dirname, '../public/images/marketers', file.filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
}

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

router.get('/daftar-karyawan', async (req, res) => {
    try {
        const tim = await modelTim.getAll()

        res.render('auth/registerKaryawan', {
            tim,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

router.post('/reg-karyawan', upload.single('foto_profil'), async (req, res) => {
    try {
        const { nama, nomor_pegawai, nomor_whatsapp, id_tim, kata_sandi, konfirmasi_kata_sandi } = req.body
        const foto_profil = req.file ? req.file.filename : 'null'
        const data = { nama, foto_profil, nomor_pegawai, nomor_whatsapp, id_tim, kata_sandi, }

        if (!nama) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nama wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!nomor_pegawai) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor Pegawai wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!nomor_whatsapp) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor WhatsApp wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!kata_sandi) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!id_tim) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Tim wajib di pilih')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!konfirmasi_kata_sandi) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Konfirmasi Kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (await modelKarywan.checkNomorPegawai(data)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor pegawai sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (await modelManajer.checkNomorPegawai(data)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor pegawai sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        const noWaRegex = /^08\d{8,11}$/
        if (!noWaRegex.test(nomor_whatsapp)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor WhatsApp yang anda inputkan tidak valid.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (await modelKarywan.checkNoWa(data)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Nomor WhatsApp sudah terdaftar.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (kata_sandi.length < 6) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata sandi minimal harus 6 karakter.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!/[A-Z]/.test(kata_sandi)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kapital.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!/[a-z]/.test(kata_sandi)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu huruf kecil.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (!/\d/.test(kata_sandi)) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata sandi harus mengandung setidaknya satu angka.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        if (kata_sandi != konfirmasi_kata_sandi) {
            deleteUploadedFile(req.file)
            req.flash('error', 'Kata sandi dan konfirmasi kata sandi tidak cocok.')
            req.flash('data', data)
            return res.redirect('/daftar-karyawan')
        }

        await modelKarywan.register(data)

        req.flash('success', 'Pendaftaran berhasil, silahkan tunggu Admin mengaktivasi akun Anda.')
        return res.redirect('/daftar-karyawan')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

router.get('/masuk', async (req, res) => {
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
        const {nomor_pegawai, kata_sandi} = req.body
        const data = {nomor_pegawai, kata_sandi}

        if (!nomor_pegawai) {
            req.flash('error', 'Nomor Pegawai wajib di isi')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (!kata_sandi) {
            req.flash('error', 'kata Sandi wajib di isi')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        let user = null
        let role = null

        user = await modelKarywan.login(data)
        if (user) {
            role = "Karyawan"
        } else {
            user = await modelManajer.login(data)
            if (user) {
                if (user.tingkat === 'Manajer') {
                    role = user.tingkat
                } else if (user.tingkat === 'Admin') {
                    role = user.tingkat
                }
            }
        }

        if (!user) {
            req.flash('error', 'Nomor Pegawai tidak terdaftar')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (user.status !== 'Aktif' && role === "Karyawan") {
            req.flash('error', 'Silahkan hubungi Manajer untuk aktifasi akun anda.')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (user.status !== 'Aktif' && user.tingkat === 'Manajer') {
            req.flash('error', 'Silahkan hubungi Admin untuk aktifasi akun anda.')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (user.status !== 'Aktif' && user.tingkat === 'Admin') {
            req.flash('error', 'Silahkan aktifasi akun anda dulu.')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (!(await bcrypt.compare(data.kata_sandi, user.kata_sandi))) {
            req.flash('error', 'Kata Sandi yang anda masukkan salah')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        req.session.userId = user.id
        req.session.role = role

        if(req.session.role === "Karyawan") return res.redirect('/karyawan/dashboard')
        if(req.session.role === "Manajer") return res.redirect('/manajer/dashboard')
        if(req.session.role === "Admin") return res.redirect('/admin/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router