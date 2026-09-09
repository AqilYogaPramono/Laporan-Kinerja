const authAdmin = async (req, res, next) => {
    try {
        if(req.session.role === "Admin") {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses kehalaman ini')
            res.redirect('/')
        }
    } catch(err) {
        console.log(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/login')
    }
}

const authKaryawan = async (req, res, next) => {
    try {
        if(req.session.role === "Karyawan") {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses kehalaman ini')
            res.redirect('/')
        }
    } catch(err) {
        console.log(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/login')
    }
}

const authManajer = async (req, res, next) => {
    try {
        if(req.session.role === "Manajer") {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses kehalaman ini')
            res.redirect('/')
        }
    } catch(err) {
        console.log(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/login')
    }
}

const authUser = async (req, res, next) => {
    try {
        if(req.session.role === "Ketua" || req.session.role === "Staf") {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses kehalaman ini')
            res.redirect('/')
        }
    } catch(err) {
        console.log(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
}

module.exports = {authAdmin, authKaryawan, authManajer, authUser}