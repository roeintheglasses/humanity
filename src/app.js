const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");
const bulmaPath = path.join(__dirname, '../node_modules/bulma/css/');

// Express Setup
app.use(express.static(publicDirectoryPath));
app.use('/bulma', express.static(bulmaPath));
app.set("view engine", "ejs");
app.set("views", viewsPath);

app.get("/", (req, res) => {
    res.render("index");
});

// Human and Alient vars for the game
var humansCount = 0;
var aliensCount = 0;




//Socket Programming

io.on("connection", (socket) => {
    console.log("New socket connection established!");

    socket.emit('humansCountUpdated', humansCount)
    socket.emit('aliensCountUpdated', aliensCount)

    socket.on('humansIncrement', () => {
        humansCount++;
        io.emit('humansCountUpdated', humansCount)
    })
    socket.on('aliensIncrement', () => {
        aliensCount++;
        io.emit('aliensCountUpdated', aliensCount)
    })

});

server.listen(port, () => {
    console.log("Server running at port " + port);
});