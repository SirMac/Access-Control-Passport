const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

const app = express()


app.set('view-engine', 'ejs')   //Set view engine to ejs
app.use(express.static(__dirname + '/static'))   //Enable use of static files
app.use(express.urlencoded({extended: false}))  //Add body obj to the Requset Obj
app.use(session({
    secret:'register success',
    resave: false,
    saveUninitialized: true, 
    cookie:{maxAge:60000}
}))

//connect flash
app.use(flash())

//global variable for flash msg
app.use((req,res,next)=>{
  res.locals.error_msg = req.flash('error_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error = req.flash('error')
  next()
})

//==Initialize Passport and setup its Session
app.use(passport.initialize())
app.use(passport.session())

//====Prevent Caching After Logout======
app.use('/dashboard',function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})

//======Routes============
app.get('/dashboard', require('./config/passport').notLoggedIn, require('./routes/index'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))

//=====Logout===========
app.get('/logout', (req,res)=>{
  req.logout();
  console.log('Successfuly Logged-out')
  res.redirect('/login');
})

//========Handle 404 Pages=========
app.use((req,res,next)=>{
    res.status(404).redirect('/login')
    next()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{console.log('Listening on Port 3000')})
