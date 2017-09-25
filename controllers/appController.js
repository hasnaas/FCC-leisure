var User=require('../models/user');
var request=require('request');
var Promise=require("promise");

//getting started, serving the home page with the search form
exports.get_started=function(req,res){
    res.render('welcome');
}

exports.get_liste=function(req,res){
    
    //Get your user data, and print the data in JSON:
getBusinessData(req.body.location)
  .then(function(data) {
    //console.log("final data "+JSON.stringify(data));
    res.render('welcome',{liste:data.data});
  }).catch(function(err) {
    var p=JSON.parse(err);
    res.render('welcome',{error:p.error.description});
  });
}

/**
 * Prepares an Object containing data for all businesses
 * @return Promise - Contains object with all business data.
 */
function getBusinessData(location) {
    
  return new Promise(function(fulfill, reject) {
    // Make the first request to get the businesses id and infos:
    var url1 = "https://api.yelp.com/v3/businesses/search?term=restaurant&location="+location;
    get(url1)
      .then(function(res) {
        var tojson = JSON.parse(res);
        //test wether there are erros
        if(tojson.error)
          reject(res);
        // Loop through the object to get what you need:
        // Set a counter though so we know once we are done.
        
        var liste=[];
        var counter=0;
        //console.log("total businesses :"+res);
        tojson.businesses.forEach(function(b){
        var business={};
        business.id=b.id;
        business.name=b.name;
        business.image_url=b.image_url;
        business.url=b.url;
          var url2 = 'https://api.yelp.com/v3/businesses/'+b.id+'/reviews';
          get(url2)
            .then(function(res2) {
              // Get what you need from the response from the 2nd URL.
            console.log(url2);
            console.log(res2);
            console.log("-------------------------------------------------------------------------------------");
            var isvalid=new RegExp('<html>');
            if(isvalid.test(res2)){
              business.topreview='review unavailable';  
            }
              
            else{
            var tojson2=JSON.parse(res2);
            if(tojson2.error)
                reject(res2);
              business.topreview=tojson2.reviews[0].text; 
              }
            liste.push(business);
            
            counter++;
            if (counter === tojson.businesses.length) {
            fulfill({data:liste}); //Return/Fulfill an object containing an array of the user data.
            }
            }).catch(function(err) {
              // Catch any errors from the 2nd HTTPS request:
              //reject({'code2':JSON.parse(err).error.description});
              reject(err);
            });
        })
        }).catch(function(err) {
          // Catch any errors from the 1st HTTPS request:
          //reject({'code1': JSON.parse(err).error.description});
          reject(err);
  });
});
    
}



/**
 * Your HTTPS GET Request Function
 * @param url - The url to GET
 * @return Promise - Promise containing the JSON response. 
 */
 function get(url) {
   return new Promise(function(fulfill, reject) {
     var options = {
        timeout: 300000,
        encoding: "utf8",
       url: encodeURI(url), //to avoid problems with accented characters
       headers: {
        'Authorization':'Bearer MN6pwWWs1xoHIEcoaUggU-Fj1cmjqjgz3bs1jhpBO5RY5BnuvBkNYvzQr1duT30K1LkvMTkuRJtYuZJ4l7KQxLkF4bOo4tbE3tvsCLG8PvuMJA40kdtMwSNRUOfGWXYx'
       
     }};
     request(options, function(err, res, body) {
       if (err) {
         reject(err);
       } else {
         fulfill(body);
       }
     });
   });
 }
 
 
