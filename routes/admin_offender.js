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
      res.render('admin/offender',{
         offenders:offenders,
         count:count
      });
   });
    });

