const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const conn = require('../config/sqldb')

exports.passportAuth = function(passport) {
  q = "SELECT * FROM `users`"
  conn.query(q, (err,result)=>{
    if(err){
      console.log(`Database Query Error ${err.code} [${err.sqlMessage}]`)
    }
    else{
      passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        if(email===result[0].email){
          bcryptjs.compare(password, result[0].password, function(hasherr, res) {
            if(hasherr){console.log(`Password hash error occured: ${hasherr}`)}
            else if(res==true){
              console.log('Successfully LoggedIn: ')
              return done(null, result[0].name, { message: 'Successful login' })
            }
            else{ 
              console.log(`Password not correct`)
              return done(null, false, { message: 'Wrong Password' })
            }
          })
        }
        else {
          console.log(`Email not correct`)
          return done(null, false, { message: 'Wrong Email' })
        }
      }))  

    passport.serializeUser(function(email, done) {
      done(null, email);
    })
    passport.deserializeUser(function(user, done) {
      done(null, user)
    }); 
    }
  }) 
}


//======Login Access Control=======
  exports.notLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg','Please log in to view that resource') 
    res.redirect('/login');
  }

//======When Logged-In, Access to Login & Register page not allowed=======
  exports.loggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');       
  }
