import React from "react";
import { Container } from "react-bootstrap";
import MainCanvas from "./MainCanvas"

function MainPage(props) {
    return (
    <Container>
        <MainCanvas></MainCanvas>
    </Container>
    );
}

export {MainPage};
