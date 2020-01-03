
module.exports = index = (req,res)=>{
    res.render('index.ejs', {title:'Home',nvbrand:'Welcome', 
    nlink:'active',rlink:'',llink:''})
}