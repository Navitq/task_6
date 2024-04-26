import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import io from "socket.io-client";
import { Link, NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import MainCanvas from "./MainCanvas";
import Boards from "./Boards";
import Introduction from "./Introduction";
import NotFound from "./NotFound";

let initCanvas = `{"store":{"document:document":{"gridSize":10,"name":"","meta":{},"id":"document:document","typeName":"document"},"page:page":{"meta":{},"id":"page:page","name":"Page 1","index":"a1","typeName":"page"},"page:6jG3lWE3d9g2Uv8ZnkAAp":{"meta":{},"id":"page:6jG3lWE3d9g2Uv8ZnkAAp","name":"Страница 1","index":"a2","typeName":"page"},"shape:dMfI-extBrr4eKvnZ1j0g":{"x":176,"y":157,"rotation":0,"isLocked":false,"opacity":1,"meta":{},"id":"shape:dMfI-extBrr4eKvnZ1j0g","type":"draw","props":{"segments":[{"type":"free","points":[{"x":0,"y":0,"z":0.5},{"x":3,"y":-2,"z":0.5},{"x":6,"y":-3,"z":0.5},{"x":8,"y":-4,"z":0.5},{"x":11,"y":-5,"z":0.5},{"x":17,"y":-6,"z":0.5},{"x":25,"y":-8,"z":0.5},{"x":35,"y":-8,"z":0.5},{"x":50,"y":-8,"z":0.5},{"x":69,"y":-8,"z":0.5},{"x":86,"y":-4,"z":0.5},{"x":104,"y":0,"z":0.5},{"x":119,"y":4,"z":0.5},{"x":133,"y":7,"z":0.5},{"x":142,"y":12,"z":0.5},{"x":151,"y":15,"z":0.5},{"x":159,"y":21,"z":0.5},{"x":163,"y":27,"z":0.5},{"x":167,"y":34,"z":0.5},{"x":170,"y":40,"z":0.5},{"x":172,"y":45,"z":0.5},{"x":175,"y":53,"z":0.5},{"x":175,"y":61,"z":0.5},{"x":175,"y":70,"z":0.5},{"x":174,"y":78,"z":0.5},{"x":174,"y":86,"z":0.5},{"x":174,"y":95,"z":0.5},{"x":176,"y":101,"z":0.5},{"x":180,"y":106,"z":0.5},{"x":182,"y":109,"z":0.5},{"x":187,"y":112,"z":0.5},{"x":193,"y":115,"z":0.5},{"x":198,"y":116,"z":0.5},{"x":206,"y":117,"z":0.5},{"x":215,"y":117,"z":0.5},{"x":223,"y":116,"z":0.5},{"x":232,"y":113,"z":0.5},{"x":242,"y":108,"z":0.5},{"x":254,"y":102,"z":0.5},{"x":263,"y":95,"z":0.5},{"x":275,"y":87,"z":0.5}]}],"color":"black","fill":"none","dash":"draw","size":"m","isComplete":false,"isClosed":false,"isPen":false},"parentId":"page:6jG3lWE3d9g2Uv8ZnkAAp","index":"a1","typeName":"shape"},"shape:pw4kU2bukyfutTXeHfwcY":{"x":324,"y":327.609375,"rotation":0,"isLocked":false,"opacity":1,"meta":{},"id":"shape:pw4kU2bukyfutTXeHfwcY","type":"draw","props":{"segments":[{"type":"free","points":[{"x":0,"y":0,"z":0.5},{"x":0,"y":0.39,"z":0.5},{"x":1,"y":-0.61,"z":0.5},{"x":4,"y":-2.61,"z":0.5},{"x":7,"y":-4.61,"z":0.5},{"x":9,"y":-6.61,"z":0.5},{"x":14,"y":-9.61,"z":0.5},{"x":19,"y":-12.61,"z":0.5},{"x":27,"y":-16.61,"z":0.5},{"x":34,"y":-21.61,"z":0.5},{"x":41,"y":-26.61,"z":0.5},{"x":48,"y":-32.61,"z":0.5},{"x":55,"y":-39.61,"z":0.5},{"x":55,"y":-39.61,"z":0.5}]}],"color":"black","fill":"none","dash":"draw","size":"m","isComplete":false,"isClosed":false,"isPen":false},"parentId":"page:page","index":"a1","typeName":"shape"}},"schema":{"schemaVersion":2,"sequences":{"com.tldraw.store":4,"com.tldraw.asset":1,"com.tldraw.camera":1,"com.tldraw.document":2,"com.tldraw.instance":24,"com.tldraw.instance_page_state":5,"com.tldraw.page":1,"com.tldraw.instance_presence":5,"com.tldraw.pointer":1,"com.tldraw.shape":4,"com.tldraw.asset.bookmark":1,"com.tldraw.asset.image":3,"com.tldraw.asset.video":3,"com.tldraw.shape.group":0,"com.tldraw.shape.text":1,"com.tldraw.shape.bookmark":2,"com.tldraw.shape.draw":1,"com.tldraw.shape.geo":8,"com.tldraw.shape.note":6,"com.tldraw.shape.line":4,"com.tldraw.shape.frame":0,"com.tldraw.shape.arrow":3,"com.tldraw.shape.highlight":0,"com.tldraw.shape.embed":4,"com.tldraw.shape.image":3,"com.tldraw.shape.video":2}}}`;
const socket = io();

function MainPage(props) {
    let [boardLint, setBoardList] = useState(null);
    let [boardLink, setBoardLink] = useState(null);
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("boards");
            socket.on("boards", (res) => {
                let boards = JSON.parse(res);
                let jsxBoards = boards.map((el) => {
                    return (
                        <Route
                            key={uuidv4()}
                            path={`/${el.name}`}
                            element={
                                <MainCanvas
                                    boardName={el.name}
                                    socket={socket}
                                ></MainCanvas>
                            }
                        ></Route>
                    );
                });

                setBoardList(jsxBoards);

                let navLink = boards.map((el) => {
                    return (
                        <NavLink
                            key={uuidv4()}
                            to={`/${el.name}`}
                            className="nav-link"
                            data-name={el.name}
                        >
                            <Card style={{ width: "18rem", margin: "7px" }}>
                                <Card.Img variant="top" src={el.img} />
                                <Card.Body>
                                    <Card.Title>{el.username}</Card.Title>
                                    <Card.Text>{el.userdes}</Card.Text>
                                    <Container className="d-flex justify-content-space" width={"auto"}>
                                        <Button variant="primary">
                                            To your canvas!
                                        </Button>
                                        <Container className="d-flex align-items-center" style={{width:"fit-content", marginRight:"0px"}}>
                                            <Card.Img
                                                variant="top"
                                                src={`./img/trash.svg`}
                                                height={"20px"}
                                                onClick = {removeCanvas}
                                            />
                                        </Container>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </NavLink>
                    );
                });
                setBoardLink(navLink);
            });
        });
    }, []);
    
    function removeCanvas(e){
        e.preventDefault()
        let parentNode = e.target.closest(".nav-link");
        socket.emit("remove_canvas", parentNode.dataset.name)
        parentNode.remove()
    }
    function newBoard(nameUser, decr, base64) {
        let name = uuidv4();
        socket.emit("message_init", name, initCanvas, nameUser, decr, base64);
        let table = (
            <NavLink key={uuidv4()} to={`/${name}`} className="nav-link" data-name={name} >
                <Card style={{ width: "18rem", margin: "7px" }}>
                    <Card.Img variant="top" src={base64} />
                    <Card.Body>
                        <Card.Title>{nameUser}</Card.Title>
                        <Card.Text>{decr}</Card.Text>
                        <Container className="d-flex justify-content-space" width={"auto"}>
                            <Button variant="primary">To your canvas!</Button>
                            <Container style={{width:"fit-content", marginRight:"0px"}} className="d-flex align-items-center">
                                <Card.Img variant="top" src={`./img/trash.svg`} height={"20px"} onClick = {removeCanvas}/>
                            </Container>
                        </Container>
                    </Card.Body>
                </Card>
            </NavLink>
        );
        setBoardLink((prev) => {
            return [...prev, table];
        });
        let route = (
            <Route
                key={uuidv4()}
                path={`/${name}`}
                element={
                    <MainCanvas boardName={name} socket={socket}></MainCanvas>
                }
            ></Route>
        );
        setBoardList((prev) => {
            return [...prev, route];
        });
    }

    return (
        <Container style={{ height: "100%" }}>
            <Routes>
                <Route
                    path={`/`}
                    exact
                    element={<Introduction> </Introduction>}
                ></Route>
                <Route
                    path={`/boards`}
                    exact
                    element={
                        <Boards boardLink={boardLink} newBoard={newBoard}>
                            {" "}
                        </Boards>
                    }
                ></Route>
                {boardLint}
                <Route path="*" element={<NotFound></NotFound>}></Route>
            </Routes>
        </Container>
    );
}

export { MainPage };
