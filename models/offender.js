var mongoose=require('mongoose');

//Page schema
var OffenderSchema=mongoose.Schema({

    name: {
        type : String,
        required : true
    },
    slug: {
        type : String
    },
    phone: {
        type : Number,
        required:true
    },
    addr: {
        type : String,
        required:true
    },
    fine: {
        type : Number
    },
    vehno : {
        type :String,
        required :true
    },
    violation: {
        type : String,
        required :true
    },
    category : {
        type : String,
        required :true
    }
});
var Offender = module.exports = mongoose.model('Offender',OffenderSchema);
