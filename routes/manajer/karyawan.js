const express = require('express')
const path = require('path')
const fs = require('fs')

const modelManajer = require('../../models/Manajer')
const modelKaryawan = require('../../models/Karyawan')
const { authManajer } = require('../../middleware/auth')

const router = express.Router()

const deleteOldPhoto = (oldPhoto) => {
    if (oldPhoto) {
        const filePath = path.join(__dirname, '../../public/images/karyawan', oldPhoto)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

router.get('/', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)

        const data = await modelKaryawan.getKaryawanBySameTeam(req.session.userId)

        res.render('manajer/karyawan', {data, manajer})
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/dashboard')
    }
})

router.post('/edit/:id', authManajer, async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        const data = {status}
        
        await modelKaryawan.updateStatusAccount(data, id)
        
        req.flash('success', 'Data Berhasil Diupdate')
        res.redirect('/manajer/karyawan')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/karyawan')
    }
})

router.post('/delete/:id', authManajer, async(req, res) => {
    try{
        const {id} = req.params

        const karyawan = await modelKaryawan.getById(id)

        if (karyawan.status !== 'Non-Aktif') {
            req.flash('error', 'Akun harus Non Aktif')
            return res.redirect('/manajer/karyawan')
        }

        deleteOldPhoto(karyawan.foto_profil)

        await modelKaryawan.deleteAccount(id)

        req.flash('success', 'Data berhasil dihapus')
        res.redirect('/manajer/karyawan')
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/manajer/karyawan')
    }
})

module.exports = router