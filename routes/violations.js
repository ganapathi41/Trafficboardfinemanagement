var express=require('express');
var router=express.Router();

//getting the page model
var Violation=require('../models/violation');

//getting the category model
var Category=require('../models/category');

//get the violations by category
router.get('/:category',function(req,res){
    var categorySlug=req.params.category;
    Category.findOne({slug: categorySlug},function(err,c){
        Violation.find({category:categorySlug},function(err,violations){
            if(err) return console.log(err);
            res.render('cat_violations', {
                title : c.title,
                violations : violations
        })
        
        
        
            })
        
    })
});

//getting the violation details
router.get('/:category/:violation',function(req,res){
    var loggedin=(req.isAuthenticated()) ? true:false;
    Violation.findOne({slug:req.params.violation},function(err,violation){
        if(err){
            return console.log(err);
        }
        else{
            res.render('violation',{
                title:violation.title,
                violation:violation,
                loggedin:loggedin
            })
        }
    })
})
//exports
module.exports=router;