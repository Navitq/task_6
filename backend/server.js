const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8888",
        methods: ["GET", "POST"],
    },
});

app.get("*", (req, res) => {
    console.log(123);
});

io.on("connection", (socket) => {
    socket.on("init", (msg) => {
        console.log("message: " + msg);
        socket.emit("init", "Hello world!")
    });
});

server.listen(4000, () => {
    console.log(server._connectionKey);
});
