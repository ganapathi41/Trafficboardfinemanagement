var mongoose=require('mongoose');

//Page schema
var ViolationSchema=mongoose.Schema({

    title: {
        type : String,
        required : true
    },
    slug: {
        type : String
    },
    desc: {
        type : String,
        required:true
    },
    category: {
        type :String,
        required:true
    },
    fine: {
        type : Number
    }
    
});
var Violation = module.exports = mongoose.model('Violation',ViolationSchema);
