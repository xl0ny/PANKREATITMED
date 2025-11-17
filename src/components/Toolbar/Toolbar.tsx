import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo/pankreatit-logo.png";
import "./Toolbar.css";

const Toolbar: React.FC = () => {
	return (
		<Navbar bg="light" variant="light" expand="lg" className="toolbar">
			<Container fluid>
				{/* ЛОГОТИП */}
                <Navbar.Brand as={Link} to="/" className="toolbar__brand d-flex align-items-center">
                <img
                    src={logoImg}
                    alt="PankreatitMed Logo"
                    height="20"
                    className="me-2"
                />
                </Navbar.Brand>

				<Navbar.Toggle aria-controls="primary-navbar" />
				<Navbar.Collapse id="primary-navbar" className="toolbar__collapse ms-auto">
					{/* КНОПКИ СПРАВА */}
					<Nav className="ms-auto toolbar__actions">
						<Nav.Link as={Link} to="/criteria">Критерии</Nav.Link>
						<Nav.Link as={Link} to="/orders">Заявки</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Toolbar;