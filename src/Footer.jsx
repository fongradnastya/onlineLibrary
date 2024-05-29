import { Container, Row, Col } from 'react-bootstrap';
import Navbar from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";
import logo from "./assets/Logo.svg";
import Facebook from "./assets/icon/Facebook.svg";
import instagram from "./assets/icon/Instagram.svg";
import linkedin from "./assets/icon/Linkedin.svg";
import youtube from "./assets/icon/YouTube.svg";

function Footer() {
    return (
        <footer className="footer mt-auto">
            <Container>
                <Row>
                    <Col xs={12} md={4} className="text-start">
                        <Navbar.Brand href="/">
                            <img src={logo} alt="Bookshelves"/>
                            <div className="brand-name">
                                Bookshelves
                            </div>
                        </Navbar.Brand>
                        <div className="footer-logos">
                            <a href="/" className="footer-logo">
                                <img className="logo-img" src={Facebook} alt="Facebook"/>
                            </a>
                            <a href="/" className="footer-logo logo-instagram">
                                <img className="logo-img" src={instagram} alt="Instagram"/>
                            </a>
                            <a href="/" className="footer-logo logo-linkedin">
                                <img className="logo-img" src={linkedin} alt="LinkedIn"/>
                            </a>
                            <a href="/" className="footer-logo logo-youtube">
                                <img className="logo-img" src={youtube} alt="YouTube"/>
                            </a>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} className="text-start">
                        <Link to="/" className="nav-link footer-link">Каталог</Link>
                        <Link to="/book-detailed" className="nav-link footer-link">Рекомендации</Link>
                        <Link to="/form" className="nav-link footer-link">Создать книгу</Link>
                    </Col>
                    <Col xs={12} sm={6} md={4} className="text-start">
                        <a className="footer-extra" href="/">ⓒ 2024 Bookshelfs Inc. All Rights Reserved.</a>
                        <a className="footer-extra" href="/">Privacy Policy</a>
                        <a className="footer-extra" href="/">Terms of Service</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;