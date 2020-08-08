var express=require('express');
var router=express.Router();
//exports
module.exports=router;

//getting the page model
var Page=require('../models/page');



//get addpage index

router.get('/',function(req,res){
   Page.find({}).exec(function(err,pages){
      res.render('admin/pages',{
         pages:pages
      });
   });
    });

//get new admin add page
router.get('/add-page',function(req,res){
   var title=" ";
   var slug=" ";
   var content=" ";
   res.render('admin/add-page',{

      title:title,
      slug:slug,
      content:content
   });
    });

// post the pages
router.post('/add-page',function(req,res){
   req.checkBody('title', 'title Must not be empty').notEmpty();
   req.checkBody('content','content Must contains some content').notEmpty();
   var title=req.body.title;
   var slug=title.replace(/\s+/g, '-').toLowerCase();
   if(slug=="")
   {
      slug=title.replace(/\s+/g, '-').toLowerCase();
   }
   var content=req.body.content;
   
   var errors=req.validationErrors();
   if(errors)
   {
   res.render('admin/add-page',{
      errors:errors,
      title:title,
      slug:slug,
      content:content
   
   });
}
else 
{
   Page.findOne({slug : slug},function(err,page){
      if(page){
         req.flash('danger','page slug exists choose another');
      
      res.render('admin/add-page',{
         errors:errors,
         title:title,
         slug:slug,
         content:content      
      });
   }
    else 
    {
   var page = new Page({
      title:title,
      slug:slug,
      content:content,
   });
   page.save(function(err){
if(err) return console.log(err);

Page.find({ }).exec(function (err, pages){
   if(err) return console.log(err);
   else
   {
    req.app.locals.pages=pages;
   }
   });
   req.flash('success','page addedd!');
   res.redirect('/admin/pages');
   });
}
});
}
});

//Get the edit page
router.get('/edit-page/:id',function(req,res){
   Page.findById(req.params.id,function(err,page){
   if(err)
      return console.log(err);
   else 
      res.render('admin/edit-page',{
      title:page.title,
      slug:page.slug,
      content:page.content,
      id:page._id
   });
    });
   });
   // post the edit pages
router.post('/edit-page/:id',function(req,res){
   req.checkBody('title', 'title Must not be empty').notEmpty();
   req.checkBody('content','content Must contains some content').notEmpty();
   var title=req.body.title;
   var content=req.body.content;
   var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
   if(slug=="")
   {
      slug=title.replace(/\s+/g,'-').toLowerCase();
   }
   var id=req.params.id;
   var errors=req.validationErrors();
   if(errors)
   {
   res.render('admin/edit-page',{
      errors:errors,
      title:title,
      slug:slug,
      content:content,
      id:id
   
   });
}
else 
{
   Page.findOne({slug:slug, _id:{'$ne':id}},function(err,page){
      if(page){
         req.flash('danger','page slug exists choose another');
      
      res.render('admin/edit-page',{
         errors:errors,
         title:title,
         slug:slug,
         content:content,
         id:id   
      });
   }
    else 
    {
   Page.findById(id,function(err,page)
   {
     if(err)
         return console.log(err);
     else
        page.title=title;
        page.slug=slug;
        page.content=content;
        page.save(function(err){
         if(err) return console.log(err);
         
         Page.find({ }).exec(function (err, pages){
            if(err) return console.log(err);
            else
            {
             req.app.locals.pages=pages;
            }
            });
         req.flash('success','page edited!');
            res.redirect('/admin/pages/edit-page/'+id);
            });
   })
  
}
});
}
});

//get the delete page
router.get('/delete-page/:id',function(req,res){
   Page.findByIdAndRemove(req.params.id,function(err){
      if(err) return console.log(err);
      else

      Page.find({ }).exec(function (err, pages){
         if(err) return console.log(err);
         else
         {
          req.app.locals.pages=pages;
         }
         });
      req.flash('success','Category deleted');

      res.redirect('/admin/pages');
   })
      });
   