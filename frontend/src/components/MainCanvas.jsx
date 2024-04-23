import React, { useLayoutEffect, useState, useEffect } from "react";
import {
    Tldraw,
    track,
    useEditor,
    createTLStore,
    defaultShapeUtils,
    throttle,
} from "tldraw";
import io from "socket.io-client";
import "./css/index.css";

const socket = io("ws://127.0.0.1:4000");
const PERSISTENCE_KEY = "my-persistence-key";

function MainCanvas(props) {
    const editor = useEditor();

    const [store] = useState(() =>
        createTLStore({ shapeUtils: defaultShapeUtils })
    );

    useEffect(() => {
		
        socket.on("ping", () => {
			console.log(222);
			socket.emit("init",`${PERSISTENCE_KEY}`);
            
        });
        socket.on("init", (data) => {
			console.log(data)
            //const snapshot = JSON.parse(data);
            //localStorage.emit(PERSISTENCE_KEY, JSON.stringify(snapshot));
        });
        socket.on("message", (err) => {
            console.log(err, 123444);
        });
    }, []);

    useLayoutEffect(() => {
        const persistedSnapshot = localStorage.getItem(PERSISTENCE_KEY);

        if (persistedSnapshot) {
            try {
                const snapshot = JSON.parse(persistedSnapshot);
                store.loadSnapshot(snapshot);
            } catch (error) {
                console.log(error);
            }
        }
        const cleanupFn = store.listen(
            throttle(() => {
                const snapshot = store.getSnapshot();
                localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot));
            }, 500)
        );

        return () => {
            cleanupFn();
        };
    }, [store]);

    return (
        <div style={{ position: "fixed", inset: 0 }}>
            <Tldraw persistenceKey="my-persistence-key" store={store} />
        </div>
    );
}

export default MainCanvas;
