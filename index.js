var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
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
  // var userData = { email: "myemail@gmail.com", password: "mypass" };
  if (
    typeof req.body.email != "undefined" &&
    typeof req.body.password != "undefined"
  ) {
    // first verify user email and password in database then go forward.
    // generate token using email id.
    // if email is same then also every time this event call on generate new token.

    // generate token using email only because it is not change for any user and unique(password not use because it can change)
    const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY); // token expire default time is 7 days
    // const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY,{ expiresIn: 20 });          // token expire in 20 seconds
    // const token = jwt.sign({ email: req.body.email }, config.SECRET_KEY,{ expiresIn: "20" });        // token expire in 20 miliseconds
    // you can also set token expire time "2 days", "10h", "7d"
    res.json({
      description:
        'Authenticated! Use this token at "Authorization" in "Bearer Token".',
      token: token,
    });
    // Output:
    // {
    //     "message": "Authenticated! Use this token at \"Authorization\" in \"Bearer Token\".",
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFqYXkudmVrYXJpeWFAYXJ0b29uLmluIiwiaWF0IjoxNTU2MDAwOTg4fQ.rfzS9GaOGe-W8DjC-uY6hy2sIjTYc9UxZqu6PCp6biI"
    // }
  }
});

app.get("/getMyProfileData", ensureToken, function (req, res) {
  console.log("in getMyProfileData.");
  jwt.verify(req.token, config.SECRET_KEY, function (err, data) {
    if (err) {
      console.log("getMyProfileData >> 403 >> err >> ", err);
      res.sendStatus(403);
    } else {
      res.json({
        description: "Profile data get successfully.",
        profileData: { email: "myemail@gmail.com", password: "mypass" },
      });
    }
  });
});

function ensureToken(req, res, next) {
  console.log("in ensureToken.");
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    console.log("ensureToken >> 403.");
    res.sendStatus(403);
  }
}

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});
