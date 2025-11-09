var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const session = require('express-session')
const flash = require('express-flash')

// router auth 
const auth = require('./routes/auth')

// router admin
const adminDashboard = require('./routes/admin/dashboard')
const adminManajer = require('./routes/admin/manajer')

// router karyawan
const karyawanDashboard = require('./routes/karyawan/dashboard')
const karyawan = require('./routes/karyawan/karyawan')
const karyawanLaporanKinerja = require('./routes/karyawan/laporanKinerja')

// router manajer
const manajerDashboard = require('./routes/manajer/dashboard')
const manajer = require('./routes/manajer/manajer')
const manajerKaryawan = require('./routes/manajer/karyawan')
const manajerTim = require('./routes/manajer/tim')
const manajerLaporanKinerja = require('./routes/manajer/laporanKinerja')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session ({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false, //ubah ke true jika sudah di hosting 
        maxAge: 600000000
    }
}))

app.use(flash())

// path auth
app.use('/', auth)

// path admin
app.use('/admin/dashboard', adminDashboard)
app.use('/admin/manajer', adminManajer)

// path manajer
app.use('/karyawan/dashboard', karyawanDashboard)
app.use('/karyawan', karyawan)
app.use('/karyawan/laporan-kinerja', karyawanLaporanKinerja)

// path manajer
app.use('/manajer/dashboard', manajerDashboard)
app.use('/manajer', manajer)
app.use('/manajer/karyawan', manajerKaryawan)
app.use('/manajer/tim', manajerTim)
app.use('/manajer/laporan-kinerja', manajerLaporanKinerja)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
