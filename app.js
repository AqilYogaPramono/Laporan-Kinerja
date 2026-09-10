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
const adminUsers = require('./routes/admin/users')
const adminTim = require('./routes/admin/tim')

//router users
const userDashboard = require('./routes/users/dashboard')
const userLaporanKinerja = require('./routes/users/laporanKinerja')
const userDokumenKinerja = require('./routes/users/dokumenKinerja')
const user = require('./routes/users/user')

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
app.use('/admin/users', adminUsers)
app.use('/admin/tim', adminTim)

// path users
app.use('/user/dashboard', userDashboard)
app.use('/user/laporan-kinerja', userLaporanKinerja)
app.use('/user/dokumen-kinerja', userDokumenKinerja)
app.use('/user', user)

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
