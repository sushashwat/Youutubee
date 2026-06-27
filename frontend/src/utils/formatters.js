/**
 * formatters.js
 * --------------
 * Small display-formatting helpers shared across video-related components.
 */

// Converts a raw view count into YouTube-style short text.
// e.g. 1500 -> "1.5K views", 2300000 -> "2.3M views", 800 -> "800 views"
export function formatViews(views) {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, '')}K views`
  }
  return `${views} views`
}

// Converts an ISO date string into a relative "x months ago" style string,
// matching how YouTube displays upload dates on video cards.
export function formatTimeAgo(dateString) {
  const uploaded = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - uploaded) / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'Today'
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
}