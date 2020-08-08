var express=require('express');
var router=express.Router();
var mkdirp=require('mkdirp');
var fs=require('fs-extra');
var resizeImg=require('resize-img');


//exports
module.exports=router;

//getting the message model
var Offender=require('../models/offender');
var Notice=require('../models/notice')



//get notice index

router.get('/',function(req,res){
   var count;
   Notice.count(function(err,c){
      count=c;
   });
   Notice.find(function(err,notices){
      res.render('admin/notices',{
         notices:notices,
         count:count
      });
   });
    });

//get new admin add notices
router.get('/add-notice',function(req,res){
   var notice=" ";
   var name=" ";
   var phone=" ";
   Offender.find(function(err,offenders){
      res.render('admin/add-notice',{
        notice:notice,
        name:name,
        phone:phone,
        offenders:offenders
      });
   })
   
    });

// post the notices
router.post('/add-notice',function(req,res){
   req.checkBody('name', 'name Must not be empty').notEmpty();
   req.checkBody('phone','phone no must not be empty').notEmpty();
   req.checkBody('notice','notice Must contains some content').notEmpty();
  
   var name=req.body.name;
   var phone=req.body.phone;
   var notice=req.body.notice;
   var offender=req.body.offender;
   var slug=name
  
   var errors=req.validationErrors();
   if(errors)
   {
      Offender.find(function(err,offenders){
         res.render('admin/add-notice',{
            errors:errors,
            name:name,
            phone:phone,
            offenders:offenders,
            notice:notice
         });
      })
}
else 
{
   Notice.findOne({slug:slug},function(err,notice){
      if(notice){
         req.flash('danger','Notice already sent');
      Offender.find(function(err,offenders){
            res.render('admin/add-notice',{
               name:name,
               phone:phone,
               offenders:offenders,
               notice:notice
            });
         }) ;
   }
    else 
    {
   var notice = new Notice({
      name:name,
      phone:phone,
      notice:notice,
      offender:offender
   });
   notice.save(function(err){
if(err) return console.log(err);
   req.flash('success','Notice sent!');
   res.redirect('/admin/notices');
   });
}
});
}
});


//get the delete violation
router.get('/delete-notice/:id',function(req,res){
   Violation.findByIdAndRemove(req.params.id,function(err){
      if(err) return console.log(err);
      else
      req.flash('success','Notice deleted');

      res.redirect('/admin/notices');
   })
      });
   