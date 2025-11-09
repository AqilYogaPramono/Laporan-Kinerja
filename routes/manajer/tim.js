const express = require('express')

const modelTim = require('../../models/Tim')
const modelManajer = require('../../models/Manajer')
const {authManajer} = require('../../middleware/auth')

const router = express.Router()

router.get('/', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)

        const data = await modelTim.getAll()

        res.render('manajer/tim/index', {data, manajer})
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/dashboard')
    }
})

router.get('/buat', authManajer, async (req, res) => {
    try {
        const manajer = await modelManajer.getNama(req.session.userId)

        res.render('manajer/tim/buat', { 
            manajer,
            data: req.flash('data')[0]
        })
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/tim')
    }
})

router.post('/create', authManajer, async (req, res) => {
    try {
        const {nama_tim} = req.body

        const data = {nama_tim}

        if (!data.nama_tim) {
            req.flash("error", "Nama Tim tidak boleh kosong")
            req.flash('data', data)
            return res.redirect('/manajer/tim/buat')
        }

        if (await modelTim.checkTimCreate(data)) {
            req.flash("error", "Nama Tim sudah ada")
            req.flash('data', data)
            return res.redirect('/manajer/tim/buat')
        }

        await modelTim.store(data)
        req.flash('success', 'Data Berhasil Ditambahkan')
        res.redirect('/manajer/tim')
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/tim')
    }
})

router.get('/edit/:id', authManajer, async(req, res) => {
    try {
        const {id} = req.params

        const manajer = await modelManajer.getNama(req.session.userId)

        const data = await modelTim.getById(id)

        res.render('manajer/tim/edit', {data, manajer})
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/tim')
    }
})

router.post('/update/:id', authManajer, async (req, res) => {
    try {
        const {id} = req.params

        const {nama_tim} = req.body

        const data = {nama_tim}
        
        if (!nama_tim) {
            req.flash("error", "Nama Tim tidak boleh kosong")
            req.flash('data', data)
            return res.redirect(`/manajer/tim/edit/${id}`)
        }

        if (await modelTim.checkTimUpdate(data, id)) {
            req.flash("error", "Nama Tim sudah ada")
            req.flash('data', data)
            return res.redirect(`/manajer/tim/edit/${id}`)
        }

        await modelTim.update(data, id)
        req.flash('success', 'Data Berhasil Diedit')
        res.redirect('/manajer/tim')
    } catch (err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/tim')
    }
})

router.post('/delete/:id', authManajer, async (req, res) => {
    try {
        const {id} = req.params

        if (await modelTim.checkTimUsed(id)) {
            req.flash("error", "Tim masih digunakan oleh karyawan")
            return res.redirect('/manajer/tim')
        }

        await modelTim.delete(id)
        req.flash('success', 'Data Berhasil Dihapus')
        res.redirect('/manajer/tim')
    } catch(err) {
        console.error(err)
        req.flash("error", 'Internal Server Error')
        return res.redirect('/manajer/tim')
    }
})

module.exports = router