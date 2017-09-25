/*global $*/

window.onload(alert(local_liste));


$("#search").on('submit',function(e){
    localStorage.setItem("Lastsearch",$("#location").val());
    //alert("Saved data "+localStorage.getItem("Lastsearch"));
})


$("#location").val(localStorage.getItem("Lastsearch"));
