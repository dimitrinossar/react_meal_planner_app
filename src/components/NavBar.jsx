import { Link, useNavigate } from 'react-router-dom'
import { auth } from '..'
import { signOut } from 'firebase/auth'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../css/NavBar.css'

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        onLogout(null)
        navigate('/')
      })
      .catch((error) => console.log(error))
  }

  return (
    <header className="navbar-header">
      <Navbar expand="lg" className="menu" sticky="top">
        <Container className="container">
          {user ? (
            <>
              <Navbar.Brand>
                <span>hello {user.email}</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item>
                      <Link to="/">Serach Recipes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/my-recipes">My Recipes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/my-meal-plan">My Meal Plan</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/my-meal-plan">My Meal Plan</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <button onClick={handleLogout}>Log out</button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item>
                      <Link to="/">Serach Recipes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/login">Log in</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/signup">Sign Ip</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  )
}
