import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ReusableNavbar = ({ brand, navLinks, dropdownLinks, onLogout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          {brand || "Brand Name"}
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Regular Nav Links */}
            {navLinks &&
              navLinks.map((link, index) => (
                <Nav.Link as={NavLink} to={link.path} key={index}>
                  {link.label}
                </Nav.Link>
              ))}

            {/* Dropdown Links */}
            {dropdownLinks && (
              <NavDropdown title="More" id="basic-nav-dropdown">
                {dropdownLinks.map((link, index) => (
                  <NavDropdown.Item as={NavLink} to={link.path} key={index}>
                    {link.label}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ReusableNavbar;
