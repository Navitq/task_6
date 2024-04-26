import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
    Tldraw,
    track,
    useEditor,
    createTLStore,
    defaultShapeUtils,
    throttle,
} from "tldraw";
import "./css/index.css";

let initCounter = false;
let dataUpd = [];


function MainCanvas(props) {
    let dataStateUpd = useRef(true);
    let PERSISTENCE_KEY = `${props.boardName}`;

    const [store] = useState(() =>
        createTLStore({ shapeUtils: defaultShapeUtils })
    );

    useEffect(() => {
        let snapshot = store.getSnapshot();
        console.log(snapshot);
        window.addEventListener("reload", () => {
            alert(123123);
        });
        console.log(12123);
        if (PERSISTENCE_KEY) {
            try {
                console.log(111111111111111111111111111);
                props.socket.emit("init", `${PERSISTENCE_KEY}`);
            } catch (error) {
                console.log(error);
            }
        }

        props.socket.on("init", async (data) => {
            console.log(22222222222222222222222222222);

            initCounter = false;
            const snapshot = JSON.parse(data);
            store.mergeRemoteChanges(() => {
                store.loadSnapshot(snapshot);
            });
            initCounter = true;
        });

        props.socket.on(`${PERSISTENCE_KEY}_add`, (data) => {
            console.log(333333333333333333333333333);

            const snapshot = JSON.parse(data);
            initCounter = false;
            store.put([snapshot]);
            initCounter = true;
        });

        props.socket.on(`${PERSISTENCE_KEY}_rem`, (data) => {
            console.log(444444444);

            const snapshot = JSON.parse(data);
            initCounter = false;
            store.mergeRemoteChanges(() => {
                store.remove([snapshot.id]);
            });
            initCounter = true;
        });

        props.socket.on(`${PERSISTENCE_KEY}_upd`, async (data) => {
            console.log(5555555);
            const snapshot = JSON.parse(data);
            initCounter = false;

            snapshot.forEach((el) => {
                store.mergeRemoteChanges(() => {
                    store.update(el.id, (old) => {
                        return el;
                    });
                });
            });
            
            initCounter = true;
        });

        let intervalId = setInterval(async () => {
            let snapshot = store.getSnapshot();

            props.socket.emit(
                "message_init",
                PERSISTENCE_KEY,
                JSON.stringify(snapshot)
            );
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);



    useLayoutEffect(() => {
        const cleanupFn = store.listen(
            throttle((change) => {
                if (initCounter && change.source !== "remote") {
                    for (const record of Object.values(change.changes.added)) {
                        if (record.typeName === "shape") {
                            props.socket.emit(
                                "message_add",
                                PERSISTENCE_KEY,
                                JSON.stringify(record)
                            );
                        }
                    }

                    for (const [from, to] of Object.values(
                        change.changes.updated
                    )) {
                        if (
                            from.id.startsWith("shape") &&
                            to.id.startsWith("shape")
                        ) {

                            if (dataStateUpd.current) {
                                console.log(dataStateUpd.current)
                                dataStateUpd.current = false;
                                setTimeout(()=>{
                                    dataStateUpd.current = true;
                                    props.socket.emit(
                                        "message_upd",
                                        PERSISTENCE_KEY,
                                        JSON.stringify(dataUpd)
                                    );
                                    dataUpd = [];
                                },200)
                            }
                            dataUpd.push(to)
                           
                        }
                    }

                    for (const record of Object.values(
                        change.changes.removed
                    )) {
                        if (record.typeName === "shape") {
                            console.log(record);
                            props.socket.emit(
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
