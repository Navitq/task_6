import { Container } from "react-bootstrap";
import {MainPage} from "./components/MainPage"
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import SiteHeader from "./components/SiteHeader"

import Footer from "./components/Footer"

function App() {
    return (
        <Container style={{minHeight:"100%", height:"100%", display:"flex", flexDirection:"column"}}>
            <BrowserRouter >
                <SiteHeader></SiteHeader> 
                <MainPage></MainPage>
                <Footer></Footer>
            </BrowserRouter>
        </Container>
    );
}

export default App;
