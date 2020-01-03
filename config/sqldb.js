const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})
   
db.connect(err => {
    return err ? console.log('Database Connection Error: ') :
    console.log('Connected to database')
})
 

module.exports = db