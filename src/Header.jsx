import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './assets/Logo.svg';


function Header() {
    return (
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img src={logo} alt="Bookshelves"/>
                        <div className="brand-name">
                            Bookshelves
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Каталог</Nav.Link>
                            <Nav.Link href="/book-detailed">Рекомендации</Nav.Link>
                            <Nav.Link href="/form">Добавить книгу</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;
