const express = require('express')
const register_route = express.Router()
const conn = require('../config/sqldb')
const joyvalidate = require('../config/joiconfig')
const bcryptjs = require('bcryptjs')


register_route.get('/', require('../config/passport').loggedIn, (req,res)=>{
    res.render('register.ejs', {title:'Register',nvbrand:'Register', 
    rlink:'active',nlink:'',llink:''})
})


register_route.post('/', joyvalidate.validateRegister, (req,res)=>{
  const {name,email,address,password} = req.body
  let mailquery = "SELECT * FROM `users` WHERE email='"+email+"'"
  conn.query(mailquery, (err,result)=>{
    if(err){
      req.flash('error_msg', 'Registration Not Successful')
      console.log(`Database Query Error ${err.code} [${err.sqlMessage}]`)
      res.redirect('/register')
      }
    else{
      if(result.length===0){
        let hashpassword
        bcryptjs.hash(password, 10, function(hasherr, hash) {
          if(hasherr){console.log(`Password hash error occured: ${hasherr}`)}
          else{
          let q = "INSERT INTO `users` (name, email, address, password) VALUES ('"+name+"', '"+email+"', '"+address+"', '"+hash+"')"
          conn.query(q, err=>{
            if(err){
              req.flash('error_msg', 'Registration Not Successful')
              console.log(`Database Query Error ${err.code} [${err.sqlMessage}]`)
              res.redirect('/register')
            }
            else{
              req.flash('success_msg', 'Registration Successful')
              res.redirect('/login')}
          })
        }
      })//hash password
    }
    else{
      req.flash('error_msg', 'Email Already Exist. Try with different email')
      console.log('Email Already Exist. Try with different email')
      res.redirect('/register')
    } 
  }
  })
})

module.exports = register_route