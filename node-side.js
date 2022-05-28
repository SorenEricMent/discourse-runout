const https = require("https");
const fs = require("fs");
const { config } = require("process");
config = {
  "cookie": {
    "_forum_session": "_forum_session=a1NrcS9KUzdTbXZJdXE1WitYVkRYRE9JNXJvcEJUNVdQWjBvaHZLU0R1NWtRaTFKdjBiTFBDT2RYMWZJeVVNRlJpUmloQWtlQUVHR3hyMEUwRFlMKzNpY3E3ckxteEpmanBjRGpCV041MHJ3SU9UVnVkaTdWNE0wdkFHdkJsWlFLQkZTZStuNTlIMFBYL0ZnL29sb0VmREVqaWF0M0QvdlA4OHJUM1FwYTZFamlTOXpNclZzMXlXYU1uSnp1ZVN3LS1yTlJjc3ZuY3Q5aTBKbUtMNzVNVHd3PT0%3D--4051f006b326c7c441687d7d9ebb9c1ac52bc1bf;",
    "_t": "_t=V0VFdkJYU2hlNUhrSGxFRVh0eWtJMGtDdGVNaHJvZFVKNWtIcUxveXBXUm1GdG5EUjY5WG1xNVR5SVhoTyswRVZRUFRPZ1llSUFMelU5dTVET3JiZ2llN21IbHQwQ3FwbHlqZ2RuOE10V29obVNrYlJlVjkxVk1kSDUycWpPbVNqcUVqSmE5RUxCTklXbVN2TWZOUVdpZnRLYkVORElxNGM2aVRqTTlRbDNjOTJjUXlPVDFQeHhudUFSTzFINmczaEJEc1hnbTFKc3JFbFRDVWdEdjlTSEgxRlE2NXIyd1dsbktjbTBzSXlGVnM1NGtZdFc5aHhwaUdSQ3NyTXpvMFFJQzQvWnoyaTM3WXpCOThnRWVNa1E9PS0tM1ZKa3UzL1dWcEtXU1FvTHVpMEUrUT09--8f97584dc36bb46055b0fd27768e5a2507eaed15;"
  },
  "username": "自动化甕嗣攞机器人",
  "csrf": 'emAH2Lb2AJF+c4sSgWXVjfJmWU/FJxjxALqHyPjFn6Dxb6ryvF12yRRm9ta+Dz8oDNVbDCGuajDOKmXp4Yc+zA==', //document.getElementsByName("csrf-token")[0].content
  "host": "https://limelight.moe",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
};

postList = [];

console.log("Discourse-runout v0.1 by Winslow SorenEricMent / I want to have some Lasagna."); //here i mean i really want to have some lasagna.
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
    let requestData = {
      "headers": {
        "user-agent": config.user_agent,
        "Cookie": config.cookie._forum_session + config.cookie._t
      },
      "credentials": "include"
    };
    https.get(config.host + "/user_actions.json?username=" + config.username + "&filter=5&offset=" + currentOffset, requestData, (res) => {
      let response = Buffer.alloc(0);
      res.on('data', function (chunk) {
        response = Buffer.concat([response, chunk]);
      });
      res.on('end', () => {
        response = response.toString();
        let data = JSON.parse(response).user_actions;
        if (data.length < 30) {
          console.log("All posts fetched, total post: " + totalPost + ", iteration count: " + iterationCount);
          postList.reverse();
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
  }, 5000);
}

function removePostInList() {
  preciseSetInterval(() => {
    if (postList.length > 0) {
      let postID = postList.pop();
      removePost(postID);
    } else {
      console.log("All posts removed.");
      clearTimeout(interval);
    }
  }, 10800);
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
      "Cookie": config.cookie._forum_session + config.cookie._t
    },
    "credentials": "include"
  };
  https.get(config.host + "/posts/" + postID, requestData, (res) => {
    console.log(res);
    console.log("statusCode: ", res.statusCode);
    console.log("Post ID: " + postID + " removed.");
    if(res.headers.hasOwnProperty("set-cookie")){
      let newCookie = res.headers["set-cookie"][0];
        config.cookie._forum_session = newCookie;
        console.log(newCookie)
    }
  });
}

function discourse_login(username,password){
  let requestData = {
    "method": "POST",
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
      "x-requested-with": "XMLHttpRequest"
    },
    "body": "username=" + username + "&password=" + password + "&redirect=" + config.host
  };
  https.get(config.host + "/login", requestData, (res) => {
    console.log(res);
    console.log("statusCode: ", res.statusCode);
    console.log("Post ID: " + postID + " removed.");
    if(res.headers.hasOwnProperty("set-cookie")){
      let newCookie = res.headers["set-cookie"][0];
        config.cookie._forum_session = newCookie;
        console.log(newCookie)
    }
  }
  );
}