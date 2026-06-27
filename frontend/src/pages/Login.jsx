  import { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { useDispatch } from 'react-redux'
  import { validateEmail, validatePassword } from '../utils/validators'
  import { login } from '../redux/slices/authSlice'
  import { users } from '../data/users'

  /**
   * Login Page
   * -----------
   * Route: "/login" - standalone page (no Header/Sidebar).
   *
   * Real authentication (server checking credentials, JWT) comes in the
   * backend step. For now: validate the form, then look up a matching
   * mock user by email to get a display name (falls back to the email's
   * local part if no match), and dispatch it into Redux auth state.
   */
  function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})

    function handleChange(e) {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit(e) {
      e.preventDefault()

      const newErrors = {
        email: validateEmail(formData.email),
        password: validatePassword(formData.password),
      }
      setErrors(newErrors)

      const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
      if (hasErrors) return

      // TODO (Backend step): replace with real POST /api/auth/login call,
      // store returned JWT (e.g. in localStorage) instead of this lookup.
      const matchedUser = users.find((u) => u.email === formData.email)
      const username = matchedUser?.username ?? formData.email.split('@')[0]
      const userId = matchedUser?.userId ?? `guest-${Date.now()}`

      dispatch(login({userId ,username, email: formData.email}))
      navigate('/')
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-yt-bg px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-yt-white border border-yt-border rounded-2xl p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-yt-text-secondary mb-6">to continue to YouTube Clone</p>

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

          <button type="submit" className="w-full bg-yt-black text-yt-white rounded-lg py-2 text-sm font-medium">
            Sign in
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