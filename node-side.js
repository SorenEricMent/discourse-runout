const needle = require("needle");
const fs = require("fs");
const config = {
    "cookie": "Enter your cookie here",
    "username": "Enter your username here",
    "csrf": "Enter your CSRF Token here",
    "host": "Enter your host here"
}

const postIDList = [];

function main(){
    console.log("Discourse-runout v0.1 by Winslow SorenEricMent");
}

function preciseSetInterval(callback, delay) {
    var timer = 0;
    var interval = setTimeout(function () {
        timer++;
        callback(timer);
        setInterval(callback, delay);
    }, delay);
}


function fetchPostData(){
    currentOffset = 0;
    iterationCount = 0;
    preciseSetInterval(function(){

        needle.get("https://www.reddit.com/r/discourse/new.json", function(err, res){

           
        });
        currentOffset+=30;
        iterationCount++;
    },5000);

}

async function removePost(postID){
  let requestData = {
    "_method":"delete",
    "headers": {
      "x-csrf-token": config.csrf
    },
    "credentials": "include"
  };
  let resp = await needle.post(config.host + "/posts/"+postID,requestData);
  return resp;
}


  