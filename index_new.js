var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var rjwt = require("restify-jwt-community");
const app = express();
app.use(bodyParser.json());
var config = { SECRET_KEY: "qWKrQRHqfQfJbvTvfmqQMopDpgTI71Jx" };

app.get("/check", function api(req, res) {
  console.log("in /check.");
  res.json({
    description: "Check Done.",
  });
});

app.post("/login", function (req, res) {
  console.log("in /login");
  console.log("login >> req.body >> ", req.body);
  // var userData = { email: "test@gmail.com", password: "mypass" };
  if (
    typeof req.body.email != "undefined" &&
    typeof req.body.password != "undefined"
  ) {
    // first verify user email and password in database then go forward.
    // generate token using email id.
    // if email is same then also every time this event call on generate new token.

    // generate token using email only because it is not change for any user and unique(password not use because it can change)
    // const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY);       // token expire default time is 7 days
    const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY, {
      expiresIn: "15m",
    }); // token expire time is 15 min
    // const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY,{ expiresIn: 20 });          // token expire in 20 seconds
    // const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY,{ expiresIn: "20" });        // token expire in 20 miliseconds
    // you can also set token expire time "2 days", "10h", "7d"
    const { iat, exp } = jwt.decode(token); // iat = issue at, exp = expire at
    res.json({
      description:
        'Authenticated! Use this token at "Authorization" in "Bearer Token".',
      tokenDetails: { iat, exp, token },
    });
    // Output:
    // {
    //     "description": "Authenticated! Use this token at \"Authorization\" in \"Bearer Token\".",
    //     "tokenDetails": {
    //         "iat": 1560767134,
    //         "exp": 1560768034,
    //         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNTYwNzY3MTM0LCJleHAiOjE1NjA3NjgwMzR9.r09xYWWExj6aC99DWYDJ0FSFv_22tgnj8rJoqYnQyUQ"
    //     }
    // }
  }
});

app.use(rjwt({ secret: config.SECRET_KEY }).unless({ path: ["/auth"] })); // this line is verify user token, from this line, every api in need to pass jwt token
// Headers:
// Authorization = jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNTYwNzY3MjU2LCJleHAiOjE1NjA3NjgxNTZ9._eZEDZ_sLLvbpHRiwCKJ_lCdWxCU10STfS1kQyJczYg

app.get("/getMyProfileData", function (req, res) {
  console.log("in getMyProfileData.");
  res.json({
    description: "Profile data get successfully.",
    profileData: { email: "myemail@gmail.com", password: "mypass" },
  });
});

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});
