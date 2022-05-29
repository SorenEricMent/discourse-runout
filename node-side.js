const https = require("https");
const fs = require("fs");

config = {
  "cookie": {
    "_forum_session": "_forum_session=x",
    "_t": "_t=x"
  },
  "username": "Your user name",
  "csrf": 'someweirdcsrftokentobefilledherexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //document.getElementsByName("csrf-token")[0].content
  "host": "https://some.sus.forum",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 Discourse-runout/0.1.1",
  "interval": {
    "remove": 1800000,// 30 minutes by default. For some reference, 1 minute is 60000, 1 hours is 3600000, 3 hours is 10800000.
    "fetch": 5000 //fetch post list, 5 second by default.
  },
  "reversed": true
};

postList = [];

console.log("Discourse-runout v0.1.1 by Winslow SorenEricMent / I want to have some Lasagna."); //here i mean i really want to have some lasagna.
fetchPostData();

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
        console.log("Fatal Error when fetching post list: Cookie expired.");
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
          console.log("All posts fetched, total post: " + totalPost + ", iteration count: " + iterationCount);
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
              console.log("Post ID: " + element.post_id + " added to list.");
            }
          }
        }
      });
    }).on('error', (err) => {
      console.warn("Get user actions error.");
      console.error(err);
    });
    console.log("Iteration #" + iterationCount + " finished.");
  }, config.interval.fetch);
}

function removePostInList() {
  preciseSetInterval(() => {
    if (postList.length > 0) {
      let postID = postList.pop();
      removePost(postID);
    } else {
      console.log("All posts removed.");
      clearTimeout(innerInterval);
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
        console.log("Post ID: " + postID + " removed.");
        break;
      case 404:
        console.log("Post ID: " + postID + " not found.");
        postList.push(postID);
        break;
      case 429:
        console.log("Discourse response with Too many requests(429), stop the whole script and wait for 5 minutes.");
        clearInterval(innerInterval);
        setTimeout(() => {
          removePostInList();
        }, 300000);
        postList.push(postID);
        break;
      case 403:
        console.log("Fatal Error: Cookie expired.");
        console.log("Script will exit now.");
        process.exit(1);
        break;
      default:
        console.log("Post ID: " + postID + " removed with error.");
        console.log("Unexpected StatusCode: " + res.statusCode);
        break;
    }
    if (res.headers.hasOwnProperty("set-cookie")) {
      let newCookie = res.headers["set-cookie"][0];
      config.cookie._forum_session = newCookie;
      console.log("new cookie settled: " + newCookie + "with resp " + res.headers["set-cookie"]);
    }
  });
}