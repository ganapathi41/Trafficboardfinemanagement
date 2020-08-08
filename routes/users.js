var express=require('express');
var router=express.Router();
var passport=require('passport');
var bcrypt=require('bcryptjs')
//getting the page model
var User=require('../models/user');

//get the register model
router.get('/register',function(req,res){
   res.render('register',{title:'Register'})
});

//To gpost aregistered model
router.post('/register',function(req,res){
   var name=req.body.name;
   var email=req.body.email;
   var username=req.body.username;
   var password=req.body.password;
   var password2=req.body.password2;

   req.checkBody('name','Name is required').notEmpty()
   req.checkBody('email','email is required').isEmail()
   req.checkBody('username','userName is required').notEmpty()
   req.checkBody('password','password is required').notEmpty()
   req.checkBody('password2','passwords dont match').equals(password);

   var errors=req.validationErrors();

   if(errors){
       res.render('register',{
           errors:errors,
           user:null,
           title:'Register'
       })
   }
   else{
       User.findOne({username:username},function(err,user){
         if(user){
             req.flash('danger','Username exist choose another');
             res.redirect('/users/register')
         }  
         else{
             var user=new User({
                 name:name,
                 email:email,
                 username:username,
                 password:password,
                 admin:0
             })
             bcrypt.genSalt(10,function(err,salt){
                 bcrypt.hash(user.password,salt,function(err,hash){
                     if(err) console.log(err);

                     user.password=hash;
                     user.save(function(err){
                         if(err) { console.log(err) }
                         else{
                            req.flash('success','you are now registered');
                            res.redirect('/users/login')
                
                         }
                     })
                 })
             })
         }
       })
   }
   


 });
 
 //get the login model
router.get('/login',function(req,res){
    if(res.locals.user) res.redirect('/')
    res.render('login',{title:'Login'})
 });

 //post the login model
 router.post('/login',function(req,res,next){
passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash:true
})(req,res,next);

 });
 //get the logout model
 router.get('/logout',function(req,res){
   req.logOut();
   req.flash('success','You have logged out');
   res.redirect('/users/login')
 });

 
//exports
module.exports=router;