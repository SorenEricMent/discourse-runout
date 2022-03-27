//Simply run this in your browser(with login session of course)
main();

async function main(){
  retryThreshold = 2;
  unwrappedUsername = $("#current-user")[0].childNodes[0].href.split("/")
  const config = {
    "username": unwrappedUsername[unwrappedUsername.length-1], //Change this to your username!
    "host": window.location.protocol + "//" + window.location.host
  }
  
  var postIDList = [];
  var CSRFToken = document.getElementsByName("csrf-token")[0].content; //获取CSRF凭证
  
}
async function fetchPostIteration(currentOffset){
  
    //https://limelight.moe/user_actions.json?offset=21&username=winslow
  try{
    removeRequestState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let requestData = await $.post(
    config.host + "/user_actions.json?offset="+currentOffset+"&username="+config.username
    ); //Maximum fetch per time: 30, out of offset = less
    let currentFetchedList = requestData.responseJSON;
    for(var i=0;i<currentFetchedList.length;i++){
    
    }
    if(currentFetchedList.length == 30){
      fetchPostIteration(currentOffset + 30);
    }else{
      console.log("Task finished at offset" + currentOffset);
    }
  }catch(){
    console.warn("Error encountered when fetching OFFSET" + currenOffset + ",skipping...");
  }

}

async function postRemoveLoop(){
  
}

function removePost(requestIndex,postID,csrf,timeToLive){
  let requestData = {
    "_method":"delete",
    "headers": {
      "x-csrf-token": CSRFToken
    },
    "creaditals": "include"
  };
  try{
    $.post(config.host + "/posts/"+postID,requestData,function callback(requestIndex,timeToLive){
      removeRequestState[requestIndex] = 1;
    });
  }catch(requestIndex,postID,csrf,timeToLive){
    if(timeToLive <= retryThreshold){
      console.warn("Request x"+requestIndex+" to remove" + postID + "failed, TTL pass, retrying...");
      removePost(requestIndex,postID,csrf,timeToLive+1)
    }else{
      console.error("Request x"+requestIndex+" to remove" + postID + " all retry failed!");
      removeRequestState[requestIndex] = -1;
    }
  }
}
