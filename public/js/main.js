$(function() {
//alert('good');
$('a.confirmDeletion').on('click',function(){
    if(!confirm('Confirm deletion')) return false;
});

});