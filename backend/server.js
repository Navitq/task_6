const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");
const db = require("./db");

const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const cluster = require("cluster");




const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


async function dbUpdate(databaseUpdatecanvasName, canvasData){
        if (!canvasName || !canvasData) {
            return;
        }
        try {
            const result = await db.query(
                `SELECT * from canvasStore WHERE name='${canvasName}'`
            );
            if (result.rowCount < 1) {
                await db.query(
                    `INSERT INTO canvasStore(name, data) VALUES ('${canvasName}', '${canvasData}')`
                );
                return;
            } else {
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

    socket.on("init", async (canvasName) => {
        const result = await db.query(
            `SELECT * from canvasStore WHERE name='${canvasName}'`
        );
        socket.emit("init",result.rows[0].data)
    });

    socket.on("message_add",(canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_add`, `${canvasData}`);
    });
    socket.on("message_rem",(canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_rem`, `${canvasData}`);
    });

    socket.on("message_upd",(canvasName, canvasData) => {
        socket.broadcast.emit(`${canvasName}_upd`, `${canvasData}`);
    });
    
    socket.on("message_init", dbUpdate);
});

server.listen(4000, async () => {
    console.log(server._connectionKey);
    try {
        const result = await db.query(`
        CREATE TABLE IF NOT EXISTS canvasStore(
            id SERIAL PRIMARY KEY,
            name  varchar(256) not null UNIQUE,
            data varchar not null
         )
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
});
