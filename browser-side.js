//Simply run this in your browser(with login session of course)
main();

async function main(){
  retryThreshold = 2;
  wrappedUsername = $("#current-user")[0].childNodes[0].href.split("/")
  config = {
    "username": wrappedUsername[wrappedUsername.length-1],
    "host": window.location.protocol + "//" + window.location.host
  }
  var postIDList = [];
  var CSRFToken = document.getElementsByName("csrf-token")[0].content; //获取CSRF凭证
  
  successCount = 0;
  failedCount = 0;
  iterationCount = 0;
  currentOffset = -30;
  requestLoop = setInterval(async function(){
    iterationCount++;
    currentOffset+=30;
    var requestData = await $.get(
      config.host + "/user_actions.json?&username="+config.username
    ); 
    var currentFetchedList = requestData.user_actions;
    let timing = 0;
    for(var i=0;i<currentFetchedList.length;i++){
      let flag = true;
      timing+=5000;
try{
      setTimeout(async function(){await removePost(currentFetchedList[i].post_id,CSRFToken)},timing);
}catch{
    if(flag){
      successCount += 1;
    }else{
      failedCount += 1
    }
    }
    }
    if(failedCount == currentFetchedList.length){
          console.log("All remove operations failed in this Iteration, check if something happened. Script halted.");
          clearInterval(requestLoop);
      }else{
      if(currentFetchedList.length != 30){
        if((failedCount + successCount) == currentFetchedList.length){
         console.log("Iteration #"+TTL+" finished,"+successCount+" post removed," + failedCount + " failed.");
        }else if((failedCount + successCount) == 30){
          console.log("Task finished at offset" +currentOffset + ", iteration #"+ TTL + "," +successCount+" post removed," + failedCount + " failed.");
        }                       
     }
    }
  },5000)
}

async function removePost(postID,csrf){
  let requestData = {
    "_method":"delete",
    "headers": {
      "x-csrf-token": csrf
    },
    "credentials": "include"
  };
  resp = await $.post(config.host + "/posts/"+postID,requestData);
  return resp;
}
