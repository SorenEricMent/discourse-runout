
https = require("https");
https.get("https://limelight.moe/t/topic/11344/45",
  {
    "headers":
    {
      "cookie" :"_t=elo0YkZqUVNGTUNuMjE2WWY0SWRpa1BTQS9DNXBQY2dJUHYrWGRzSWdPRmFXb1grNElHRmhoOVdtbUVmUU1YdnNpajZIaGdueGhiY1BkbGF0c1NjOThxNzFvYzR3alJDMWJhR0ZpNmU3SHc5M1VWR0hZTEFZVXZlV1Rzcmx1dHFydFowSHNJRVNwbC9YSE1nSWhFaTBqalZuZDUwYVBrT3E3WTRLSTFuVW1zb2tpVHZTakhqcXRUZlhqdWgrTVFHK1IvZ1VlY0wvdFpSd0VIcG1zNEFZa0tMZUJjMytCQ28zZ2xkQjlRZUxnMVdqUjJvTFZxU05nYkM0WUFvNFpaamdXSFNiTHFmR2k0TmxsL05KTHd2c0E9PS0tRFpBejcveHVhcUo5N2hsVzRWRUFBdz09--3b929c3357be916d172bfc8bc9df0127cb2e21e5; _forum_session=WU50eUxhU1dmWlllc0JYNitjVnp5ZUZ6TTczQ2JHTHJBUWw2R0lHRTNidDhEcDB2WnhRcHBDN2RiMlBGZHh4SENkOW5KTzI3YTdZMjBJb2hsRG1jMEtzS3dwVWV2ditnMEc3Wko5Rjh1V3JiUlhIT1llZk0zdmN5MDVFalA5QzZzc1EyVFUydnVFdG5BMmJsSkdNaGV6c2ZDSmVZODJuY2lOVStWMDN2YWFXZTRlR3FQM1RiOHFiT3lBTmNjN0tiLS1jbkdNSCs2Q2oyWHBTeEFvVXBlWnFBPT0%3D--78d4668e8feb0ba8bf7232089bf927dd3c15ed04",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
      "dont-chunk": "true"
    }, "credentials": "include"
  }, (res) => {
    console.log("headers: ", res.headers['set-cookie']);
    let response = Buffer.alloc(0);
    res.on('data', function (chunk) {
      response = Buffer.concat([response,chunk]);
    });
    res.on('end', (res) =>{
      //console.log("headers: ", res.headers);
    })
  }).on('error', (e) => {
    console.error(e);
  }
  )

//Create a https request