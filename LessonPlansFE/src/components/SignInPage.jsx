import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/authSlice'
import SignUpDialog from './SignUpDialog'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const SignInPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signUpOpen, setSignUpOpen] = useState(false)
  const dispatch = useDispatch()
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      alert(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      localStorage.setItem('token', token)
      dispatch(setUser({ username, token }))
    }
  }, [result.data, dispatch, username])

  const handleSubmit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  const handleSignUpOpen = () => setSignUpOpen(true)
  const handleSignUpClose = () => setSignUpOpen(false)

  return (
    <div className='signin-container'>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type='text'
          id='username'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
        <input 
        type='password' 
        id='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button type='submit'>Sign In</button>
      </form>
      <button onClick={handleSignUpOpen}>Sign Up</button>
      <SignUpDialog open={signUpOpen} onClose={handleSignUpClose} />
    </div>
  )
}

export default SignInPage