var express=require('express');
var router=express.Router();
var mkdirp=require('mkdirp');
var fs=require('fs-extra');
var resizeImg=require('resize-img');


//exports
module.exports=router;

//getting the page model
var Violation=require('../models/violation');
var Category=require('../models/category')


//get violations index

router.get('/',function(req,res){
   var count;
   Violation.count(function(err,c){
      count=c;
   });
   Violation.find(function(err,violations){
      res.render('admin/violations',{
         violations:violations,
         count:count
      });
   });
    });

//get new admin add violations
router.get('/add-violation',function(req,res){
   var title=" ";
   var desc=" ";
   var fine=" ";
   Category.find(function(err,categories){
      res.render('admin/add-violation',{

         title:title,
         desc:desc,
         categories:categories,
         fine:fine
      });
   })
   
    });

// post the violations
router.post('/add-violation',function(req,res){
   req.checkBody('title', 'title Must not be empty').notEmpty();
   req.checkBody('desc','description Must contains some content').notEmpty();
   req.checkBody('fine','fine Must contains some price').notEmpty();
   var title=req.body.title;
   var desc=req.body.desc;
   var fine=req.body.fine;
   var category=req.body.category;
   var slug=title.replace(/\s+/g,'-').toLowerCase();
  
   var errors=req.validationErrors();
   if(errors)
   {
      Category.find(function(err,categories){
         res.render('admin/add-violation',{
            errors:errors,
            title:title,
            desc:desc,
            categories:categories,
            fine:fine
         });
      })
}
else 
{
   Violation.findOne({slug:slug},function(err,violation){
      if(violation){
         req.flash('danger','violation title exists choose another');
         Category.find(function(err,categories){
            res.render('admin/add-violation',{
               title:title,
               desc:desc,
               categories:categories,
               fine:fine
            });
         }) ;
   }
    else 
    {
   var violation = new Violation({
      title:title,
      slug:slug,
      desc:desc,
      category:category,
      fine:fine
   });
   violation.save(function(err){
if(err) return console.log(err);
   req.flash('success','violation addedd!');
   res.redirect('/admin/violations');
   });
}
});
}
});

//Get the edit iviolations

router.get('/edit-violation/:id',function(req,res){
   var errors;
   if(req.session.errors)
   {
      errors=req.session.errors;
   }
   else
   {
      req.session.errors=null;
   }
   Category.find(function(err,categories){
   Violation.findById(req.params.id,function(err,v){
   if(err)
   {
      return console.log(err);
      res.redirect('/admin/violations');
   }
      else 
   res.render('admin/edit-violation',{
      errors:errors,
      title:v.title,
      desc:v.desc,
      categories:categories,
      category:v.category.replace(/\s+/g,'-').toLowerCase(),
      fine:v.fine,
      id:v._id
   });
   });
    });
   });
   // post the edit violations
   router.post('/edit-violation/:id',function(req,res){
      req.checkBody('title', 'title Must not be empty').notEmpty();
      req.checkBody('desc','description Must contains some content').notEmpty();
      req.checkBody('fine','fine Must contains some price').notEmpty();
      var title=req.body.title;
      var desc=req.body.desc;
      var fine=req.body.fine;
      var category=req.body.category;
      var slug=title.replace(/\s+/g,'-').toLowerCase();
      var id=req.params.id;

      var errors=req.validationErrors();
      if(errors){
         req.session.errors=errors;
         res.redirect('/admin/violations/edit-violation/'+id)
      }
      else
      {
         Violation.findOne({slug:slug,_id:{'$ne':id}},function(err,v){
            if(err)
            {
               return console.log(err);
            }
            if(v)
            {
               req.flash('danger','violation title exists choose another');
               
               res.redirect('/admin/violations/edit-violation/'+id)
            }
            else{
            Violation.findById(id,function(err,v){
               if(err)
               {
                  return console.log(err)
               }
               v.title=title;
               v.slug=slug;
               v.desc=desc;
               v.fine=fine;
               v.title=title;
               v.category=category;
               v.save(function(err){
               if(err){
                 return console.log(err)
               }
               req.flash('success','Violation edited Successfully');
               res.redirect('/admin/violations/edit-violation/'+id);
               })
            
            })
         }      
         })
      
      }
   });

//get the delete violation
router.get('/delete-violation/:id',function(req,res){
   Violation.findByIdAndRemove(req.params.id,function(err){
      if(err) return console.log(err);
      else
      req.flash('success','Violation deleted');

      res.redirect('/admin/violations');
   })
      });
   