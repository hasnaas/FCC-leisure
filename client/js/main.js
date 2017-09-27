/*global $*/
$(document).ready(function(){
$('#mytable').paginate({ limit: 5 });        
});



$("#search").on('submit',function(e){
    localStorage.setItem("Lastsearch",$("#location").val());
})


$("#location").val(localStorage.getItem("Lastsearch"));
