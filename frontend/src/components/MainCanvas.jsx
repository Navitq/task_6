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

const socket = io();
let initCounter = false;
const PERSISTENCE_KEY = "my-persistence-key";

function MainCanvas(props) {
    const editor = useEditor();

    const [store] = useState(() =>
        createTLStore({ shapeUtils: defaultShapeUtils })
    );

    useEffect(() => {


        socket.on("connect", () => {
            if (PERSISTENCE_KEY) {
                try {
                    console.log(111111111111111111111111111);
                    socket.emit("init", `${PERSISTENCE_KEY}`);
                } catch (error) {
                    console.log(error);
                }
            }
            socket.on("init", async (data) => {
                console.log(22222222222222222222222222222)

                initCounter = false;
                const snapshot = JSON.parse(data);
                store.mergeRemoteChanges(()=>{store.loadSnapshot(snapshot)});
                initCounter = true;
            });

            socket.on(`${PERSISTENCE_KEY}_add`, (data) => {
                console.log(333333333333333333333333333)
                
                const snapshot = JSON.parse(data);
                initCounter = false;
                store.put([snapshot])
                initCounter = true;
            });

            socket.on(`${PERSISTENCE_KEY}_rem`, (data) => {
                console.log(444444444)
                
                const snapshot = JSON.parse(data);
                initCounter = false;
                store.remove([snapshot.id]);
                initCounter = true;
            });

            socket.on(`${PERSISTENCE_KEY}_upd`, (data) => {
                console.log(5555555)
                const snapshot = JSON.parse(data);
                initCounter = false;

                //store.put([snapshot])
                store.update(snapshot.id, updater(snapshot) );
                initCounter = true;

            });

        });
    }, []);

    useLayoutEffect(() => {
        const cleanupFn = store.listen(
            throttle((change) => {
                
                console.log(initCounter);
                if (true && change.source !== "remote") {
                    let snapshot;
                    for (const record of Object.values(change.changes.added)) {
                        
                        if (record.typeName === "shape") {
                            snapshot = store.getSnapshot();


                            socket.emit(
                                "message_add",
                                PERSISTENCE_KEY,
                                JSON.stringify(record)
                            );
                            
                        }
                    }

                    for (const [from, to] of Object.values(change.changes.updated)) {
                        
                        if (
                            from.id.startsWith("shape") &&
                            to.id.startsWith("shape")
                        ) {
                            snapshot = store.getSnapshot();
                            console.log(to)
                            socket.emit(
                                "message_upd",
                                PERSISTENCE_KEY,
                                JSON.stringify(to)
                            );
                        }
                    }

                    for (const record of Object.values(
                        change.changes.removed
                    )) {
                        if (record.typeName === "shape") {
                            console.log(record)
                            snapshot = store.getSnapshot();
                            socket.emit(
                                "message_rem",
                                PERSISTENCE_KEY,
                                JSON.stringify(record)
                            );
                        }
                    }
                    
                }
            })
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
