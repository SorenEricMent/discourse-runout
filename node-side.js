const https = require("https");
const sqlite3 = require('sqlite3');
async function wrapper(){
  const inquirer = (await import("inquirer")).default;

  let db = new sqlite3.Database('./posts.sqlite');

  config = {
    "cookie": {
      "_forum_session": "_forum_session=x",
      "_t": "_t=x",
    },
    "username": "Your user name",
    "csrf": 'someweirdcsrftokentobefilledherexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //document.getElementsByName("csrf-token")[0].content
    "host": "https://some.sus.forum",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Discourse-runout/0.2.2",
    "interval": {
      "remove": 1800000,// 30 minutes by default. For some reference, 1 minute is 60000, 1 hours is 3600000, 3 hours is 10800000.
      "fetch": 5000 //fetch post list, 5 second by default.
    },
    "reversed": true
  };

  postList = [];
  db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER);");
  console.log('\x1b[33m%s\x1b[0m',"Discourse-runout v0.2.2 by Winslow SorenEricMent / I still want to have some Lasagna."); //here i mean i really want to have some lasagna.
  db.all("SELECT id from posts", (errors,rows) =>{
      console.log(rows);
      if(rows.length == 0){
          console.log('\x1b[33m%s\x1b[0m',"No posts found in database. Fetching posts...");
          fetchPostData();
      }else{
        console.log('\x1b[33m%s\x1b[0m',"Posts found in local database. Use prefetched database?");
        let question = {
          "type": 'list',
          "name": "Use prefetched",
          "choices": [ "Yes, use lists fetched last time.", new inquirer.Separator(), "No, refetch posts." ]
        };
        inquirer.prompt(question).then(answer => {
          if(answer["Use prefetched"] == "Yes, use lists fetched last time."){
            console.log('\x1b[33m%s\x1b[0m',"Using prefetched database.");
            for(const element in rows){
              postList.push(rows[element].id);
            }
            removePostInList();
          }else{
            console.log('\x1b[33m%s\x1b[0m',"Refetching posts...");
            fetchPostData();
          }
      });
    }
    //on error
    db.on('error', (err) => {
      console.log('\x1b[33m%s\x1b[0m',"Error: " + err);
    });
  });
}


function preciseSetInterval(callback, delay) {
  var timer = 0;
  innerInterval = setTimeout(function () {
    timer++;
    callback(timer);
    preciseSetInterval(callback, delay);
  }, delay);
}

function fetchPostData() {
  currentOffset = 0;
  iterationCount = 0;
  totalPost = 0;
  preciseSetInterval(() => {
    iterationCount++;
    let requestData = {
      "headers": {
        "user-agent": config.user_agent,
        "Cookie": config.cookie._forum_session + ";" + config.cookie._t
      },
      "credentials": "include"
    };
    https.get(config.host + "/user_actions.json?username=" + config.username + "&filter=5&offset=" + currentOffset, requestData, (res) => {
      if(res.statusCode == 403){
        console.log('\x1b[31m%s\x1b[0m',"Fatal Error when fetching post list: Cookie expired.");
        process.exit(1)
      }
      let response = Buffer.alloc(0);
      res.on('data', function (chunk) {
        response = Buffer.concat([response, chunk]);
      });
      res.on('end', () => {
        response = response.toString();
        let data = JSON.parse(response).user_actions;
        if (data.length < 30) {
          console.log('\x1b[34m%s\x1b[0m',"All posts fetched, total post: " + totalPost + ", iteration count: " + iterationCount);
          if (config.reversed) {
            postList.reverse();
          }
          clearTimeout(innerInterval);
          removePostInList();
        } else {
          totalPost += data.length;
          currentOffset += 30;
          for (const element of data) {
            if (!element.deleted) {
              postList.push(element.post_id);
              db.run("INSERT into posts (id) VALUES (" + element.post_id + ")");
              console.log('\x1b[32m%s\x1b[0m',"Post ID: " + element.post_id + " added to list.");
            }
          }
        }
      });
    }).on('error', (err) => {
      console.warn('\x1b[31m%s\x1b[0m',"Get user actions error.");
      console.error(err);
    });
    console.log('\x1b[32m%s\x1b[0m',"Iteration #" + iterationCount + " finished.");
  }, config.interval.fetch);
}

function removePostInList() {
  preciseSetInterval(() => {
    if (postList.length > 0) {
      let postID = postList.pop();
      removePost(postID);
    } else {
      console.log('\x1b[33m%s\x1b[0m',"All posts removed.");
      clearTimeout(innerInterval);
      process.exit(0);
    }
  }, config.interval.remove);
}

async function removePost(postID) {
  let requestData = {
    "method": "DELETE",
    "mode": "cors",
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "discourse-logged-in": "true",
      "discourse-present": "true",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": config.csrf,
      "user-agent": config.user_agent,
      "x-requested-with": "XMLHttpRequest",
      "Cookie": config.cookie._forum_session + ";" + config.cookie._t
    },
    "credentials": "include"
  };
  https.get(config.host + "/posts/" + postID, requestData, (res) => {
    switch (res.statusCode) {
      case 200:
        console.log('\x1b[32m%s\x1b[0m',"Post ID: " + postID + " removed.");
        db.run("DELETE FROM posts WHERE id=" + postID + ";");
        break;
      case 404:
        console.log('\x1b[32m%s\x1b[0m',"Post ID: " + postID + " not found.");
        db.run("DELETE FROM posts WHERE id=" + postID + ";");
        break;
      case 429:
        console.log('\x1b[31m%s\x1b[0m',"Discourse response with Too many requests(429), stop the whole script and wait for 5 minutes.");
        clearInterval(innerInterval);
        setTimeout(() => {
          removePostInList();
        }, 300000);
        postList.push(postID);
        db.run("INSERT into posts (id) VALUES (" + postID + ")");
        break;
      case 403:
        console.log('\x1b[31m%s\x1b[0m',"Fatal Error: Cookie expired.");
        console.log('\x1b[31m%s\x1b[0m',"Script will exit now.");
        process.exit(1);
        break;
      default:
        console.log('\x1b[31m%s\x1b[0m',"Post ID: " + postID + " removed with error.");
        console.log('\x1b[31m%s\x1b[0m',"Unexpected StatusCode: " + res.statusCode);
        db.run("DELETE FROM posts WHERE id=" + postID + ";");
        break;
    }
    if (res.headers.hasOwnProperty("set-cookie")) {
      let cookies = res.headers["set-cookie"];
      if(cookies.length > 1){
        config.cookie._forum_session = cookies[1];
        config.cookie._t = cookies[0];
      }else{
        config.cookie._forum_session = cookies[0];
      }
  }
}
);
}
wrapper();