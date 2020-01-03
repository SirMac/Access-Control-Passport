const Joi = require('joi')

exports.validateRegister = (req,res,next) => {
 const schema = Joi.object().keys({
   name: Joi.string().trim().min(3).max(30).required(),
   email: Joi.string().email().min(3).max(30).required(),
   address: Joi.string().min(3).required(),
   password: Joi.string().min(3).max(15).required()
})

//Create Object to validate so as to include Files
   const {name,email,address,password} = req.body
   const dataToValidate = {name,email,address,password}

  Joi.validate(dataToValidate, schema, (err,result)=>{
      if(err){
            req.session.error_msg = err.details[0].message
            console.log('Joi Validation Not Successful',err.details[0].message)
            res.redirect('/register')
      }
     
      else{
         console.log('Joi Validation Successful')
         next()
      }
   })
}



exports.validateLogin = (req,res,next) => {
   const schema = Joi.object().keys({
     password: Joi.string().trim().min(3).max(15).required(),
     email: Joi.string().email().min(3).max(15).required()
  })
  
  //Create Object to validate
   const {password,email} = req.body
   const dataToValidate = {password,email}
  
   Joi.validate(dataToValidate, schema, (err,result)=>{
      if(err){
            req.session.error_msg = err.details[0].message
            console.log('Joi Validation Not Successful',err.details[0].message)
            res.redirect('/login')
      }
      
      else{
         console.log('Joi Validation Successful')
         next()
      }
   })
}