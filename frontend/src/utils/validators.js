/**
 * validators.js
 * --------------
 * Shared form validation helpers. Each function returns an empty string
 * if valid, or an error message string if invalid - so components can
 * directly render the returned value as the error text.
 */

export function validateUsername(value){
    if(!value.trim()) return 'Username is required'
    if(value.trim().length <3) return 'Username must be atleast 3 characters'
     if (/\s/.test(value)) return 'Username cannot contain spaces'
  return ''
}

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Enter a valid email address'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return ''
}