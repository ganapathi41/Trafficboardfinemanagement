var express=require('express');
var router=express.Router();

//getting the page model
var Violation=require('../models/violation');

//get all the violations to checkout
router.get('/add/:violation',function(req,res){
    var slug=req.params.violation;
    Violation.findOne({slug: slug},function(err,v){
        if(err) return console.log(err);
        
       if(typeof req.session.cart=="undefined"){
      
        req.session.cart=[];
        req.session.cart.push({
            title:slug,
            qty:1,
            fine:v.fine
        })
       }
       else{
           var cart=req.session.cart;
           var newItem=true;
           for(var i=0;i<cart.length;i++){
               if(cart[i].title==slug){
                   cart[i].qty++;
                   newItem=false;
                   break;
               }
           }
           if(newItem){
            cart.push({
                title:slug,
                qty:1,
                fine:v.fine
            })
           }
       }
     console.log(req.session.cart);
     req.flash('success','ADDED!!! Now you can checkout..');
     res.redirect('back');
        
    })
});

//Get the checkout page
router.get('/checkout',function(req,res){
    if(req.session.cart && req.session.cart.length==0){
        delete req.session.cart;
        res.redirect('/cart/checkout');
    }
    else{
    res.render('checkout',{
        title:'Checkout',
        cart:req.session.cart
    });
}
});

//Get the update page
router.get('/update/:violation',function(req,res){
var slug=req.params.violation;
var cart=req.session.cart;
var action=req.query.action;
for(var i=0;i<cart.length;i++)
{
    if(cart[i].title==slug){
        switch(action){
            case "remove":
                cart[i].qty--;
                if(cart[i].qty<1) cart.splice(i, 1);
                break;
            default:console.log('update problem');
                    break;
        }
        break;
    }
}
req.flash('success','updated..');
     res.redirect('/cart/checkout');
});

//Get the checkout page
router.get('/clear',function(req,res){
    
        delete req.session.cart;
        req.flash('success','cart cleared');
        res.redirect('/cart/checkout');
    
});
//get the buynow page
router.get('/buynow',function(req,res){
    if(req.session.cart && req.session.cart.length==0){
        delete req.session.cart;
        res.redirect('/cart/buynow');
    }
    else{
    res.render('buynow',{
        title:'buynow',
        cart:req.session.cart
    });
}
});

//get
//Get the checkout page
router.get('/buynow',function(req,res){
    
    
    res.redirect('/cart/buynow');
});
//paid
router.get('/pay',function(req,res){
    
    delete req.session.cart;
    req.flash('success','paid the fine');
    res.redirect('/cart/checkout');

});
//exports
module.exports=router;