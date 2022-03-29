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
  removePostIteration(0,CSRFToken,1);
}
async function removePostIteration(currentOffset,CSRFToken,TTL){
    let requestData = await $.get(
    config.host + "/user_actions.json?offset="+currentOffset+"&username="+config.username
    ); 
    let currentFetchedList = requestData.user_actions;
    loopCounter = 0;
    successCount = 0;
    failedCount = 0;
    requestLoop = setInterval(async function(currentOffset,currentFetchedList,CSRFToken,TTL){
      let isSuccess = true;
      try{
        await removePost(loopCounter,currentFetchedList[loopCounter].post_id,CSRFToken);
      }catch{
        isSuccess = false;
      }
      
      if(isSuccess){
        successCount++;
      }else{
        failedCount++;
      }
      
      if(failedCount == (currentFetchedList.length){
          console.log("All remove operations failed in this Iteration, check if something happened. Script halted.");
          clearInterval(requestLoop);
      }else{
      if(currentFetchedList.length != 30){
        if((failedCount + successCount) == currentFetchedList.length){
         console.log("Iteration #"+TTL+" finished,"+successCount+" post removed," + failedCount + " failed.");
        }else if((failedCount + successCount) == 30){
          console.log(("Task finished at offset" +currentOffset + ", iteration #"+ TTL + "," +successCount+" post removed," + failedCount + " failed.");
        }                       
      }
    },2000)
}

async function removePost(requestIndex,postID,csrf){
  let requestData = {
    "_method":"delete",
    "headers": {
      "x-csrf-token": CSRFToken
    },
    "credentials": "include"
  };
  return await $.post(config.host + "/posts/"+postID,requestData);
}
