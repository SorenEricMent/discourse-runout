//Simply run this in your browser(with login session of course)
main();

async function main(){
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js";
  document.body.appendChild(script); //注入jQuery
  
  var CSRFToken = document.getElementsByName("csrf-token")[0].content; //获取CSRF凭证
  
}
async function fetchAllPastPost(){
  
    //https://limelight.moe/user_actions.json?offset=21&username=winslow
  await $.post();
}

function fetchPostPromise(){

}

async function deletePost(postID,csrf){
  let requestData = {"_method":"delete"};
  await $.post("https:/ /limelight.moe/posts/"+postID,requestData);
}
