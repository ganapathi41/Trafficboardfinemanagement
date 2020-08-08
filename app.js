var express=require('express');
var session = require('express-session')
var path=require('path');
const mongoose = require('mongoose');
var config=require('./config/database')
var bodyParser = require('body-parser');
var session=require('express-session');
var flash=require('connect-flash');
var expressValidator=require('express-validator');
var passport=require('passport');
var fileUpload=require('express-fileupload');
const ejsLint = require('ejs-lint');

//connect to the mongodb
mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected to mongodb');
})

//init app
var app=express();

//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//set global errors variable
app.locals.errors=null;

//get page model
var Page=require('./models/page');
Page.find({ }).exec(function (err, pages){
    if(err) return console.log(err);
    else
    {
     app.locals.pages=pages;
    }
    });

//get the categories model
var Category=require('./models/category');
Category.find({ }).exec(function (err, categories){
    if(err) return console.log(err);
    else
    {
     app.locals.categories=categories;
    }
    });



//fileupload middleware
app.use(fileUpload());

//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
 //  cookie: { secure: true }
  }));
//express validator middleware
app.use(expressValidator({
errorFormatter:function(param,msg,value){
var namespace=param.split('.')
,root=namespace.shift()
,formParam=root;
while(namespace.length){
    formParam+='['+namespace.shift()+']';
}
return{

    param:formParam,
    msg:msg,
    value:value
};
}
}));

//express-messages middleware
app.use(flash());
app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});
//passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
    res.locals.cart=req.session.cart;
    res.locals.user=req.user || null;
    next();
})

//router set up
var pages=require('./routes/pages.js')
var violations=require('./routes/violations.js')
var cart=require('./routes/cart.js')
var adminpages=require('./routes/admin_pages.js')
var adminCategories=require('./routes/admin_categories.js')
var adminViolations=require('./routes/admin_violations.js')
var adminOffenders=require('./routes/admin_offenders.js')
var adminnotices=require('./routes/admin_notices.js')
var adminOffender=require('./routes/admin_offender.js')
var users=require('./routes/users.js');

app.use('/admin/categories',adminCategories);
app.use('/admin/pages',adminpages);
app.use('/admin/violations',adminViolations);
app.use('/cart',cart);
app.use('/admin/offenders',adminOffenders);
app.use('/admin/offender',adminOffender);
app.use('/admin/notices',adminnotices);
app.use('/users',users);
app.use('/',pages);
app.use('/violations',violations);


//start the server
var port=3000;
app.listen(port,function(){
    console.log('Server started.........*')
});

