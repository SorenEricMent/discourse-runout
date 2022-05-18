https = require("https");
https.get("https://limelight.moe/user_actions.json?offset=0&username=winslow",
{"headers":
{"Cookie": "","user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
},"credentials": "include"
},(res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  
  }).on('error', (e) => {
    console.error(e);
  }
)

