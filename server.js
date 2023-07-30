const express=require('express')
const app=express()
const ejs=require('ejs')
const bodyparser=require('body-parser')
const port=3000
const mongoose=require('mongoose')
require('dotenv').config()
app.use(express.json())
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:false}))
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));
app.get('/',(req,res)=>{
    res.render('../views/index')
})
const userschema=new mongoose.Schema({
    email:String,
    password:String,
    user:String
})
const user=mongoose.model('user',userschema)
app.get('/getall',async(req,res)=>{
   const list= await user.find();
    list=>list.JSON()
    res.send(list)
   });
app.post('/',(req,res)=>{
    const name=req.body.mail
    const pass=req.body.password
    const usr=req.body.user_name
    const new_user=new user({
        email:name,
        password:pass,
        user:usr
    })
    new_user.save();
    res.render('../views/card',{username:usr})
})
app.get('/login',(req,res)=>{
    res.render('../views/signin')
})
app.post('/login',async(req,res)=>{
    const signinname=req.body.name_login
    const signinpass=req.body.password_login
   if(await user.findOne({user:signinname,password:signinpass})){
      res.render('../views/card',{username:signinname})
   }
   else{
      res.render('../views/signin',{rev:'Invalid Credentials'})
   }
})
app.listen(port,function(err){
    if(err){
        console.log('Error')
    }
    else{
        console.log('Server running ')
    }
})