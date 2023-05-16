import { Link, NavLink, useNavigate } from 'react-router-dom'
import { auth } from '..'
import { signOut } from 'firebase/auth'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import '../css/NavBar.css'
import { AiFillHome } from 'react-icons/ai'

export default function NavBar({ user, loading }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login')
      })
      .catch((error) => console.log(error))
  }

  return (
    <header className="navbar-wrapper">
      <Link to="/">
        <h1 className="logo">Plan My Plate</h1>
      </Link>
      <Navbar collapseOnSelect expand="sm" className="menu" sticky="top">
        <Navbar.Toggle
          aria-controls="navbarScroll"
          data-bs-target="#navbarScroll"
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            {loading ? (
              <NavLink>
                <p>Loading...</p>
              </NavLink>
            ) : (
              <>
                <NavLink eventkey="1" to="/" className="home">
                  <AiFillHome size={20} />
                </NavLink>
                {user ? (
                  <div className="logged-in">
                    <NavLink eventkey="4" to={`/user/${user.uid}`}>
                      Hello {user.displayName}
                    </NavLink>
                    <NavLink eventkey="2" to="/my-recipes">
                      My Recipes
                    </NavLink>
                    <NavLink eventkey="3" to="/my-meal-plans">
                      My Meal Plans
                    </NavLink>
                    <NavDropdown.Divider />
                    <NavLink eventkey="5">
                      <button onClick={handleLogout}>Log out</button>
                    </NavLink>
                  </div>
                ) : (
                  <div className="login-signup">
                    <NavLink eventkey="2" to="/login">
                      Log in
                    </NavLink>
                    <span>/</span>
                    <NavLink eventkey="4" to="/signup">
                      Sign up
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
