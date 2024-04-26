const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const db = require("./db");

const numCPUs = require("os").cpus().length;

const { parentPort, workerData, Worker } = require("worker_threads");

const app = express();

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 5e7,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

async function dbUpdate(canvasName, canvasData, nameUser, decr, base64) {
    if (!canvasName || !canvasData) {
        return;
    }

    try {
        const result = await db.query(
            `SELECT * from canvasStore WHERE name='${canvasName}'`
        );
        if (result.rowCount < 1) {
            await db.query(
                `INSERT INTO canvasStore(name, data, userDes, userName, img) VALUES ('${canvasName}', '${canvasData}', '${decr}', '${nameUser}', '${base64}')`
            );
            return;
        } else {
            console.log(canvasName);
            await db.query(
                `UPDATE canvasStore SET data='${canvasData}'  WHERE name='${canvasName}'`
            );
        }
    } catch (err) {
        console.error(err);
    }
}

app.get("*", (req, res) => {
    console.log(123);
});

io.on("connect", (socket) => {
    socket.on("boards", async (req, res) => {
        try {
            const result = await db.query(
                `SELECT name, userDes, userName, img from canvasStore`
            );
            socket.emit("boards", JSON.stringify(result.rows));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("init", async (canvasName) => {
        const result = await db.query(
            `SELECT * from canvasStore WHERE name='${canvasName}'`
        );
        socket.emit("init", result.rows[0].data);
    });

    socket.on("message_add", (canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_add`, `${canvasData}`);
    });
    socket.on("remove_canvas",(canvasName) => {
        console.log(canvasName, "920a3e74-cb07-489a-b907-a4716ba36676")
        try {
            db.query(`DELETE FROM canvasStore WHERE name='${canvasName}'`);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("message_rem", (canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_rem`, `${canvasData}`);
    });

    socket.on("message_upd", async (canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_upd`, `${canvasData}`);
    });

    socket.on("message_init", dbUpdate);
});

server.listen(4000, async (req, res) => {
    console.log(server._connectionKey);
    try {
        const result = await db.query(`
        CREATE TABLE IF NOT EXISTS canvasStore(
            id SERIAL PRIMARY KEY,
            name  varchar(256) not null UNIQUE,
            userDes  varchar not null,
            userName varchar not null,
            data varchar not null,
            img varchar not null
         )
        `);
    } catch (err) {
        console.error(err);
        //res.status(500).send("Internal Server Error");
        return;
    }
});
