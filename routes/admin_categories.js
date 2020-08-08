var express=require('express');
var router=express.Router();
//exports
module.exports=router;

//getting the page model
var Category=require('../models/category');



//get addcategories index

router.get('/',function(req,res){
     Category.find(function(err,categories){
        if(err) return console.log(err);
        else
        {
        res.render('admin/categories',{
         categories:categories
        });
      }
     });
      });


//get new admin categories page
router.get('/add-category',function(req,res){
   var title=" ";
   res.render('admin/add-category',{

      title:title
   });
    });

// post the added category
router.post('/add-category',function(req,res){
   req.checkBody('title', 'title Must not be empty').notEmpty();
   
   var title=req.body.title;
   
   var slug=title.replace(/\s+/g,'-').toLowerCase();
   
   var errors=req.validationErrors();
   if(errors)
   {
   res.render('admin/add-category',{
      errors:errors,
      title:title
   
   });
}
else 
{
   Category.findOne({slug:slug},function(err,category){
      if(category){
         req.flash('danger','category slug exists choose another');
      
      res.render('admin/add-category',{
         errors:errors,
         title:title,
           
      });
   }
    else 
    {
   var category = new Category({
      title:title,
      slug:slug
   });
   category.save(function(err){
if(err) return console.log(err);
Category.find({ }).exec(function (err, categories){
   if(err) return console.log(err);
   else
   {
    req.app.locals.categories=categories;
   }
   });
   req.flash('success','categories addedd!');
   res.redirect('/admin/categories');
   });
}
});
}
});
//Reordering of the pages
router.post('/reorder-pages',function(req,res){
var ids=req.body['id[]'];
var count=0;
for(var i=0; i < ids.length ; i++)
{
var id=ids[i];
count++;
(function(count){
Page.findById(id,function(err,page){
   page.sorting=count;
   page.save=(function(err){
   if(err) return console.log(err);
   
   });
});
})(count);
   }
      });
//Get the edit categories
router.get('/edit-category/:id',function(req,res){
   Category.findById(req.params.id,function(err,category){
   if(err)
      return console.log(err);
   else 
      res.render('admin/edit-category',{
      title:category.title,
      id:category._id
   });
    });
   });
   // post the edit categories
router.post('/edit-category/:id',function(req,res){
   req.checkBody('title', 'title Must not be empty').notEmpty();
   var title=req.body.title;
  
   var slug=title.replace(/\s+/g,'-').toLowerCase();
   
   var id=req.params.id;
   var errors=req.validationErrors();
   if(errors)
   {
   res.render('admin/edit-category',{
      errors:errors,
      title:title,
      
      id:id
   
   });
}
else 
{
   Category.findOne({slug:slug, _id:{'$ne':id}},function(err,category){
      if(category){
         req.flash('danger','category slug exists choose another');
      
      res.render('admin/edit-category',{
         errors:errors,
         title:title,
         
         id:id   
      });
   }
    else 
    {
   Category.findById(id,function(err,category)
   {
     if(err)
         return console.log(err);
     else
        category.title=title;
        category.slug=slug;
        
        category.save(function(err){
         if(err) return console.log(err);
         Category.find({ }).exec(function (err, categories){
            if(err) return console.log(err);
            else
            {
             req.app.locals.categories=categories;
            }
            });   
         req.flash('success','category addedd!');
         res.redirect('/admin/categories/edit-category/'+id);
            });
   })
  
}
});
}
});

//get the delete categories
router.get('/delete-category/:id',function(req,res){
   Category.findByIdAndRemove(req.params.id,function(err){
      if(err) return console.log(err);
      else
      Category.find({ }).exec(function (err, categories){
         if(err) return console.log(err);
         else
         {
          req.app.locals.categories=categories;
         }
         });
      req.flash('success','Category deleted');
      res.redirect('/admin/categories');
   })
      });
   