import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../features/auth/authSlice'

const SignInPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const status = useSelector(state => state.auth.status)
  console.log('current auth status', status)

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(signIn({ username, password }))
  }

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
    </div>
  )
}

export default SignInPage
