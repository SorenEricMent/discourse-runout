//Simply run this in your browser(with login session of course)
main();

async function main(){
  const config = {
    "username": "winslow" //Change this to your username!
  }
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js";
  document.body.appendChild(script); //注入jQuery
  
  var postIDList = [];
  var CSRFToken = document.getElementsByName("csrf-token")[0].content; //获取CSRF凭证
  
}
async function fetchPostIteration(currentOffset){
  
    //https://limelight.moe/user_actions.json?offset=21&username=winslow
  try{
    let requestData = await $.post(
    "https://limelight.moe/user_actions.json?offset="+currentOffset+"&username="+config.username
    ); //Maximum fetch per time: 30, out of offset = less
  }catch{
    console.warn("Error encountered when fetching OFFSET" + currenOffset + ",skipping...");
  }

}

async function postRemoveLoop(){
  
}

async function removePost(postID,csrf){
  let requestData = {"_method":"delete"};
  await $.post("https:/ /limelight.moe/posts/"+postID,requestData);
}
