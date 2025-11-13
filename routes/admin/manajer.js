const express = require('express')

const modelAdmin = require('../../models/Admin')
const modelManajer = require('../../models/Manajer')
const { authAdmin } = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)

        const data = await modelManajer.getManajer()

        res.render('admin/manajer', {data, admin})
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/edit/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        const data = {status}
        
        await modelManajer.updateStatusAccount(data, id)
        
        req.flash('success', 'Data Berhasil Diupdate')
        res.redirect('/admin/manajer')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/manajer')
    }
})

router.post('/delete/:id', authAdmin, async(req, res) => {
    try{
        const {id} = req.params

        const manajer = await modelManajer.getById(id)

        if (manajer.status != 'Non-Aktif') {
            req.flash('error', 'Akun harus Non Aktif')
            return res.redirect('/admin/manajer')
        }
        
        await modelManajer.deleteAccount(id)

        req.flash('success', 'Data berhasil dihapus')
        res.redirect('/admin/manajer')
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/manajer')
    }
})


module.exports = router