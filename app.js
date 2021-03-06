var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	mongoose      = require("mongoose"),
	Campground    = require("./models/campground"),
	seedDB        = require("./seeds"),
	User          = require("./models/user"),
	Comment       = require("./models/comment"),
	flash         = require("connect-flash");

//requiring routes
var commentRoutes     = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	indexRoutes       = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/angie_camp";

// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
mongoose.connect(url); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database    //seedDB();
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, function() {
	console.log("AngieCamp is running!");
});
// PORT need to be changed to 3000 for goorm

