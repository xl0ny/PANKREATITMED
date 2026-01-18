import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectUser, logout, logoutAsync } from "../../store/slices/authSlice";
import { clearQuery } from "../../store/slices/filterSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { clearPankreatitOrders } from "../../store/slices/pankreatitordersSlice";
import logoImg from "../../assets/logo/pankreatit-logo.png";
import "./Toolbar.css";

const Toolbar: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	const handleLogout = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			await dispatch(logoutAsync(token) as any);
		}
		// Сбрасываем все состояния
		dispatch(clearQuery());
		dispatch(clearCart());
		dispatch(clearPankreatitOrders());
		dispatch(logout());
		navigate("/");
	};

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
					<Nav className="ms-auto toolbar__actions align-items-center">
						<Nav.Link as={Link} to="/criteria">Критерии</Nav.Link>
						{isAuthenticated && (
							<Nav.Link as={Link} to="/pankreatitorders">Заключения</Nav.Link>
						)}
						{isAuthenticated ? (
							<NavDropdown
								title={user?.login || "Пользователь"}
								id="user-dropdown"
								className="ms-2"
							>
								<NavDropdown.Item as={Link} to="/profile">
									Личный кабинет
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={handleLogout}>
									Выход
								</NavDropdown.Item>
							</NavDropdown>
						) : (
							<Link to="/login" className="ms-2">
								<Button variant="primary">
									Вход
								</Button>
							</Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Toolbar;