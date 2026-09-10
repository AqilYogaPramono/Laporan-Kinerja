const express = require('express')

const modelTim = require('../../models/Tim')
const modelAdmin = require('../../models/Admin')
const {authAdmin} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)

        const data = await modelTim.getAll()

        res.render('admin/tim/index', {data, admin})
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/dashboard')
    }
})

router.get('/buat', authAdmin, async (req, res) => {
    try {
        const admin = await modelAdmin.getNama(req.session.userId)

        res.render('admin/tim/buat', { 
            admin,
            data: req.flash('data')[0]
        })
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/tim')
    }
})

router.post('/create', authAdmin, async (req, res) => {
    try {
        const {nama_tim} = req.body

        const data = {nama_tim}

        if (!data.nama_tim) {
            req.flash("error", "Nama Tim tidak boleh kosong")
            req.flash('data', data)
            return res.redirect('/admin/tim/buat')
        }

        if (await modelTim.checkTimCreate(data)) {
            req.flash("error", "Nama Tim sudah ada")
            req.flash('data', data)
            return res.redirect('/admin/tim/buat')
        }

        await modelTim.store(data)
        req.flash('success', 'Data Berhasil Ditambahkan')
        res.redirect('/admin/tim')
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/tim')
    }
})

router.get('/edit/:id', authAdmin, async(req, res) => {
    try {
        const {id} = req.params

        const admin = await modelAdmin.getNama(req.session.userId)

        const data = await modelTim.getById(id)

        res.render('admin/tim/edit', {data, admin})
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/tim')
    }
})

router.post('/update/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params

        const {nama_tim} = req.body

        const data = {nama_tim}
        
        if (!nama_tim) {
            req.flash("error", "Nama Tim tidak boleh kosong")
            req.flash('data', data)
            return res.redirect(`/admin/tim/edit/${id}`)
        }

        if (await modelTim.checkTimUpdate(data, id)) {
            req.flash("error", "Nama Tim sudah ada")
            req.flash('data', data)
            return res.redirect(`/admin/tim/edit/${id}`)
        }

        await modelTim.update(data, id)
        req.flash('success', 'Data Berhasil Diedit')
        res.redirect('/admin/tim')
    } catch (err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/tim')
    }
})

router.post('/delete/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params

        if (await modelTim.checkTimUsedUser(id)) {
            req.flash("error", "Tim masih digunakan oleh anggota user")
            return res.redirect('/admin/tim')
        }

        await modelTim.delete(id)
        req.flash('success', 'Data Berhasil Dihapus')
        res.redirect('/admin/tim')
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/admin/tim')
    }
})

module.exports = router