const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

//Path and Env variables Setup
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;
const publicDirectoryPath = path.join(__dirname, "../public");
const bulmaPath = path.join(__dirname, "../node_modules/bulma/css/");
const alertsPath = path.join(__dirname, "../node_modules/alerts-css/assets/");

//Passport Config
require('../config/passport.js')(passport);

// Setting up routes 
const usersRoute = require('../routes/users');
const indexRoute = require('../routes/index');

//Express and Socket.io consts
const app = express();
const server = http.createServer(app);
const io = socket(server);

// Human and Alient vars for the game
var humansCount = 0;
var aliensCount = 0;
const humanLimit = 1000;
const alienLimit = 100;


// Express & ejs Setup
app.use(express.static(publicDirectoryPath));
app.use(expressLayouts);
app.set("view engine", "ejs");


//Bodyparser
app.use(express.urlencoded({
    extended: false
}));

//Express Session 
app.use(session({
    secret: 'roewuzhere',
    resave: true,
    saveUninitialized: true,
}))

//Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/game', indexRoute);
app.use('/users', usersRoute);
app.use("/bulma", express.static(bulmaPath));
app.use("/alerts", express.static(alertsPath));



//Mongoose Setup
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//Socket Programming
io.on("connection", (socket) => {
    console.log("New socket connection established!");

    socket.emit("humansCountUpdated", humansCount);
    socket.emit("aliensCountUpdated", aliensCount);

    socket.on("humansIncrement", () => {
        humansCount++;
        io.emit("humansCountUpdated", humansCount);
    });
    socket.on("aliensIncrement", () => {
        aliensCount++;
        io.emit("aliensCountUpdated", aliensCount);
    });
});


//Server start
server.listen(port, console.log("Server running at port " + port));