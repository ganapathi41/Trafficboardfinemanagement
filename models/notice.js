var mongoose=require('mongoose');

//Page schema
var NoticeSchema=mongoose.Schema({

    name: {
        type : String,
        required : true
    },
    slug: {
        type : String
    },
    phone: {
        type : Number,
        required : true
    },
    notice: {
        type : String
    }
});
var Notice = module.exports = mongoose.model('Notice',NoticeSchema);
