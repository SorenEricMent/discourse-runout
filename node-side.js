const needle = require("needle");
const fs = require("fs");
const config = {
    "cookie": "Enter your cookie here",
    "username": "Enter your username here",
    "csrf": "Enter your CSRF Token here",
    "host": "https://Enter your host here"
}

postList = [];

function main(){
    console.log("Discourse-runout v0.1 by Winslow SorenEricMent / Vele!");
}

function preciseSetInterval(callback, delay) {
    var timer = 0;
    var interval = setTimeout(function () {
        timer++;
        callback(timer);
        preciseSetInterval(callback, delay);
    }, delay);
}



function fetchPostData(){
    currentOffset = 0;
    iterationCount = 0;
    preciseSetInterval(function(){
      let requestData = {
        "headers": {
          "x-csrf-token": config.csrf
          "cookie": config.cookie
        },
        "credentials": "include"
      }
        needle.get(config.host + "/user_actions.json?&username=" + config.username + "offset=" + currentOffset, requestData,function(err, res){
            if(err){
                console.log(err);
            }
            else{
                let data = JSON.parse(res.body).user_actions;
                switch(data.length){
                  case data.length >= 30:
                    currentOffset += 30;
                    for(const element of data){
                      if(!element.deleted && element.action_type == 4){
                        totalPostList.push(element.post_id); //action_type: 5=Topic, 4=Reply.
                        console.log("Post ID: " + element.post_id + " added to list.");
                        clearTimeout(interval);
                      }
                    }
                    break;
                  case data.length < 30:
                    console.log("All posts fetched.");
                }
            }
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


  