import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import { Routes, Route } from 'react-router-dom'
import LogInPage from './pages/LogInPage'
import NavBar from './components/NavBar'
import RecipeDetailsPage from './pages/RecipeDetailsPage'
import { Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'

function App() {
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <div className="App">
      <NavBar user={user} onLogOut={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            !results ? (
              <HomePage onSearch={setResults} />
            ) : (
              <SearchResultsPage results={results} />
            )
          }
        />
        <Route
          path="/recipes/:id"
          element={<RecipeDetailsPage results={results} />}
        />
        <Route
          path="/login"
          element={
            !user ? <LogInPage onLogIn={setUser} /> : <Navigate to="/" />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App
