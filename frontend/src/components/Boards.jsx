import React, { useEffect, useState, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Boards(props) {
    const [show, setShow] = useState(false);
    let fileRef = useRef();
    let nameRef = useRef();
    let decrRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function checkCanvas(e){
        e.target.closest(".modal-content").querySelector(".modal-body form .submit-btt").click();
    }

    function createCanvas(e) {
        e.preventDefault()
        let reader = new FileReader();
        let link = document.createElement('a');
        link.download = 'hello.png';

        reader.readAsDataURL(fileRef.current.files[0]);
        reader.onload = function() {
            props.newBoard(nameRef.current.value ,decrRef.current.value,reader.result);
        };
        handleClose();
    }

    return (
        <Container>
            <Container className="d-flex justify-content-center">
                <Button variant="primary" onClick={handleShow}>
                    Add Canvas
                </Button>
            </Container>
            <Container className="d-flex justify-content-around my-4 flex flex-wrap">
                {props.boardLink}
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createCanvas}>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Canvas name</Form.Label>
                            <Form.Control
                                required
                                ref={nameRef}
                                type="text"
                                placeholder="Enter some name"
                                autoFocus
                                
                            />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Your canvas image</Form.Label>
                            <Form.Control required ref={fileRef} type="file" accept="image/png, image/jpeg"/>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Canvas description</Form.Label>
                            <Form.Control required ref={decrRef} as="textarea" rows={3} />
                        </Form.Group>
                        <Button type="submit" className="d-none submit-btt" ></Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={checkCanvas}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Boards;
