import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { validateEmail, validatePassword } from '../utils/validators'
import { loginUser } from '../redux/slices/authSlice'

/**
 * Login Page
 * -----------
 * Route: "/login" - standalone page (no Header/Sidebar).
 * Dispatches the loginUser thunk, which calls the real backend.
 */

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { status, error: apiError } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    }
    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) return

    const result = await dispatch(loginUser(formData))
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-yt-white border border-yt-border rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-1">Login in</h1>
        <p className="text-sm text-yt-text-secondary mb-6">to continue to YouTube Clone</p>

        {apiError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {apiError}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none
                          ${errors.email ? 'border-red-500' : 'border-yt-border focus:border-blue-500'}`}
          />
          {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none
                          ${errors.password ? 'border-red-500' : 'border-yt-border focus:border-blue-500'}`}
          />
          {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>}
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-yt-black text-yt-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
        >
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-sm text-center mt-4">
          New here?{' '}
          <Link to="/signup" className="text-blue-600 font-medium">Create an account</Link>
        </p>
      </form>
    </div>
  )
}

export default Login