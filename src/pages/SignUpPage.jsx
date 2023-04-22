import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth } from '..'
import '../css/SignUpPage.css'

export default function SignUpPage({ onLogin }) {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = ({ target }) => {
    setLoginInfo({ ...loginInfo, [target.name]: target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((userCredential) => {
        onLogin(userCredential.user)
        navigate('/')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <section className="signup-section">
      <h1>Sign Up</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input type="text" value={loginInfo.email} name="email" />
        <label htmlFor="">Password</label>
        <input type="password" value={loginInfo.password} name="password" />
        <button>Sign Up</button>
      </form>
    </section>
  )
}
