import { useState } from "react";
import {Link,useNavigate} from "react-router-dom";
import { validateUsername, validateEmail, validatePassword } from '../utils/validators'

/**
 * Signup Page
 * ------------
 * Route: "/signup" - standalone page (no Header/Sidebar).
 *
 * Validates username, email, and password on submit, shows inline errors.
 * On success, redirects to /login per assignment spec.
 *
 * NOTE: does NOT call a real API yet - wired up once backend + Redux
 * auth slice exist. For now, only client-side validation.
 */

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    }
    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) return

    // TODO (Backend step): replace with real POST /api/auth/register call.
    console.log('Registering user:', formData)
    navigate('/login')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-yt-white border border-yt-border rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-yt-text-secondary mb-6">to continue to YouTube Clone</p>

        <label className="block mb-4">
          <span className="text-sm font-medium">Username</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none
                        ${errors.username ? 'border-red-500' : 'border-yt-border focus:border-blue-500'}`}
          />
          {errors.username && <span className="text-xs text-red-500 mt-1 block">{errors.username}</span>}
        </label>

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
          Sign up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default Signup