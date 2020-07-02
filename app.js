const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { COOKIE_SECRET, SESSION_SECRET, PORT, HOSTNAME } = require("./env");


const { configStrategy, isAuthenticated } = require("./config/passport");
const woman = require("./controller/woman");
const womanProfile = require("./controller/womanprofile");
const employer = require("./controller/employer");
const job  = require("./controller/job");
const msme = require("./controller/msme");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use(cookieParser(COOKIE_SECRET));

app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
configStrategy(passport);

app.use(function (req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "/public")));
// woman login logout related routes...
app.get("/woman/login", woman.getLogin);
app.post("/woman/login", woman.postLogin);
app.get("/woman/signup", woman.getSignup);
app.post("/woman/signup", woman.postSignup);
app.get("/woman/logout", isAuthenticated, woman.getLogout);
app.get("/woman/dashboard",isAuthenticated, woman.getWomanDashboard);

// woman profileupdate routes
app.get("/woman/profile", isAuthenticated, womanProfile.getProfile);
app.post("/woman/updateaadhar", isAuthenticated, womanProfile.postAaadharUpdate);
app.post("/woman/updateprofile", isAuthenticated, womanProfile.postUpdateProfile);
app.post("/woman/updatepan", isAuthenticated, womanProfile.postUpdateProfile);

// employer login logout related routes
app.get("/employer/signup", employer.getSignupEmployer);
app.post("/employer/signup", employer.postSignupEmployer);
app.get("/employer/login", employer.getLoginEmployer);
app.post("/employer/login",employer.postLoginEmployer);
app.get("/employer/dashboard",isAuthenticated, employer.getEmployerDashboard);
app.get("/employer/logout", isAuthenticated, employer.getEmployerLogout);
app.get("/employer/verify", employer.getVerifyEmployer);
app.post("/employer/verify", employer.postVerifyEmployer);


// employer profile update routes


// job related routes
app.get("/addnewjob",isAuthenticated, job.getAddNewJob);
app.post("/addnewjob", isAuthenticated, job.postAddNewJob);
app.get("/searchjobs", isAuthenticated, job.getSearchJobs);
app.post("/searchjobs", isAuthenticated, job.postSearchJobs);
app.get("/deletejob", isAuthenticated, job.getDeleteJob);
app.post("/deletejob", isAuthenticated, job.postDeleteJob);


// msme routes...

app.get("/msme/signup", msme.getMsmeSignup);
app.post("/msme/signup", msme.postMsmeSignup);


const server = http.createServer(app);

server.listen(PORT, HOSTNAME, function () {
  console.log(`server is listening at http://${HOSTNAME}:${PORT}`);
})