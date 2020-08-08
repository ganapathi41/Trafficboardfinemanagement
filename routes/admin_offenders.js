var express=require('express');
var router=express.Router();
var mkdirp=require('mkdirp');
var fs=require('fs-extra');


//exports
module.exports=router;

//getting the page model
var Violation=require('../models/violation');
var Category=require('../models/category');
var Offender=require('../models/offender');


//get offenders index

router.get('/',function(req,res){
   var count;
   Offender.count(function(err,c){
      count=c;
   });
   Offender.find(function(err,offenders){
      res.render('admin/offenders',{
         offenders:offenders,
         count:count
      });
   });
    });

//get new admin add offenders
router.get('/add-offender',function(req,res){
   var name=" ";
   var phone=" ";
   var addr=" ";
   var fine=" ";
   var vehno=" ";
   Category.find(function(err,categories){
      Violation.find(function(err,violations){
      res.render('admin/add-offender',{

         name:name,
         phone:phone,
         addr:addr,
         fine:fine,
         vehno:vehno,
         violations:violations,
         categories:categories
      });
   })
})
    });

// post the addedd offenders
router.post('/add-offender',function(req,res){
   req.checkBody('name', 'name Must not be empty').notEmpty();
   req.checkBody('phone','phone number Must not be empty').notEmpty();
   req.checkBody('fine','fine Must contains some price').notEmpty();
   req.checkBody('vehno','vehicle number Must not be empty').notEmpty();
   var name=req.body.name;
   var phone=req.body.phone;
   var addr=req.body.addr;
   var fine=req.body.fine;
   var vehno=req.body.vehno;
   var category=req.body.category;
   var violation=req.body.violation;
   var slug=name.replace(/\s+/g,'-').toLowerCase();
   var errors=req.validationErrors();
   if(errors)
   {
      Category.find(function(err,categories){
         Violation.find(function(err,violations){
         res.render('admin/add-offender',{
            errors:errors,
            name:name,
            phone:phone,
            addr:addr,
            vehno:vehno,
            categories:categories,
            violations:violations,
            fine:fine
         });
      })
   })
}
else 
{
   Offender.findOne({slug:slug},function(err,offender){
      if(offender){
         req.flash('danger','offender  exists choose another');
         Category.find(function(err,categories){
            Violation.find(function(err,violations){
            res.render('admin/add-offender',{
               name:name,
               phone:phone,
               addr:addr,
               vehno:vehno,
               categories:categories,
               violations:violations,
               fine:fine
            });
            });
         }) ;
   }
    else 
    {
   var offender = new Offender({
      name:name,
      phone:phone,
      addr:addr,
      vehno:vehno,
      category:category,
      violation:violation,
      fine:fine
   });
   offender.save(function(err){
if(err) return console.log(err);
   req.flash('success','offenders addedd!');
   res.redirect('/admin/offenders');
   });
}
});
}
});

//Get the edit iviolations

router.get('/edit-offender/:id',function(req,res){
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
      Violation.find(function(err,violations){
   Offender.findById(req.params.id,function(err,o){
   if(err)
   {
      return console.log(err);
      res.redirect('/admin/offenders');
   }
      else 
   res.render('admin/edit-offender',{
      errors:errors,
      name:o.name,
      phone:o.phone,
      categories:categories,
      category:o.category.replace(/\s+/g,'-').toLowerCase(),
      fine:o.fine,
      addr:o.addr,
      vehno:o.vehno,
      violation:o.violation,
      violations:violations,
      id:o._id
   });
   });
})
    });
   });
   // post the edit violations
   router.post('/edit-offender/:id',function(req,res){
      req.checkBody('name', 'name Must not be empty').notEmpty();
   req.checkBody('phone','phone number Must not be empty').notEmpty();
   req.checkBody('fine','fine Must contains some price').notEmpty();
   req.checkBody('vehno','vehicle number Must not be empty').notEmpty();
   var name=req.body.name;
   var phone=req.body.phone;
   var addr=req.body.addr;
   var fine=req.body.fine;
   var vehno=req.body.vehno;
   var category=req.body.category;
   var violation=req.body.violation;
   var slug=name.replace(/\s+/g,'-').toLowerCase();
   var id=req.params.id;

      var errors=req.validationErrors();
      if(errors){
         req.session.errors=errors;
         res.redirect('/admin/offenders/edit-offender/'+id)
      }
      else
      {
         Offender.findOne({slug:slug,_id:{'$ne':id}},function(err,o){
            if(err)
            {
               return console.log(err);
            }
            if(o)
            {
               req.flash('danger','offender exists choose another');
               
               res.redirect('/admin/offenders/edit-offender/'+id)
            }
            else{
            Offender.findById(id,function(err,o){
               if(err)
               {
                  return console.log(err)
               }
               o.name=name;
               o.slug=slug;
               o.addr=addr;
               o.fine=fine;
               o.phone=phone;
               o.category=category;
               o.violation=violation;
               o.vehno=vehno;
               o.save(function(err){
               if(err){
                 return console.log(err)
               }
               req.flash('success','Offenders edited Successfully');
               res.redirect('/admin/offenders/edit-offender/'+id);
               })
            
            })
         }      
         })
      
      }
   });

//get the delete violation
router.get('/delete-offender/:id',function(req,res){
   Offender.findByIdAndRemove(req.params.id,function(err){
      if(err) return console.log(err);
      else
      req.flash('success','Offender deleted');

      res.redirect('/admin/offenders');
   })
      });
   