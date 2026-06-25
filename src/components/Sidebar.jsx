import {
  Home, Clapperboard, Rss, History, ListVideo, Clock, ThumbsUp,
  Flame, Music2, Gamepad2, Newspaper, Trophy, GraduationCap
} from 'lucide-react'

/**
 * Sidebar Component
 * ------------------
 * Left navigation panel. Two modes controlled by `isOpen` prop (lifted to App.jsx,
 * toggled via the hamburger button in Header):
 *   - isOpen = true  -> full sidebar (icon + label), width 240px
 *   - isOpen = false -> collapsed sidebar (icon only, centered), width 72px
 *
 * Sections (mirrors real YouTube's grouping):
 *   1. Primary nav: Home, Shorts, Subscriptions
 *   2. "You" section: History, Playlists, Watch later, Liked videos
 *   3. Explore section: Trending, Music, Gaming, News, Sports, Learning
 *
 * NOTE: Links are not wired to React Router yet (done in the Routing step).
 * For now this only renders the static nav structure.
 */
function Sidebar({ isOpen }) {
  const primaryNav = [
    { label: 'Home', icon: Home },
    { label: 'Shorts', icon: Clapperboard },
    { label: 'Subscriptions', icon: Rss },
  ]

  const youSection = [
    { label: 'History', icon: History },
    { label: 'Playlists', icon: ListVideo },
    { label: 'Watch later', icon: Clock },
    { label: 'Liked videos', icon: ThumbsUp },
  ]

  const exploreSection = [
    { label: 'Trending', icon: Flame },
    { label: 'Music', icon: Music2 },
    { label: 'Gaming', icon: Gamepad2 },
    { label: 'News', icon: Newspaper },
    { label: 'Sports', icon: Trophy },
    { label: 'Learning', icon: GraduationCap },
  ]

  // Reusable row renderer - avoids repeating the same JSX for every list above
  const renderItem = ({ label, icon: Icon }) => (
    <button
      key={label}
      className={`flex items-center w-full rounded-lg hover:bg-yt-hover-bg
                  ${isOpen ? 'gap-4 px-3 py-2.5' : 'flex-col gap-1 py-3'}`}
    >
      <Icon size={isOpen ? 20 : 22} />
      <span className={isOpen ? 'text-sm' : 'text-[10px]'}>{label}</span>
    </button>
  )

  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-yt-white
                  border-r border-yt-border overflow-y-auto py-2 px-2
                  transition-all duration-200
                  ${isOpen ? 'w-60' : 'w-[72px]'}`}
    >
      {/* Primary navigation - always visible, expanded or collapsed */}
      <div className="flex flex-col gap-1">
        {primaryNav.map(renderItem)}
      </div>

      {/* "You" section - hidden when collapsed (matches real YouTube behaviour:
          a narrow rail only shows top-level items to avoid clutter) */}
      {isOpen && (
        <>
          <hr className="my-2 border-yt-border" />
          <p className="text-xs font-semibold text-yt-text-secondary px-3 mb-1">You</p>
          <div className="flex flex-col gap-1">
            {youSection.map(renderItem)}
          </div>
        </>
      )}

      {/* Explore section - same reasoning, only shown when expanded */}
      {isOpen && (
        <>
          <hr className="my-2 border-yt-border" />
          <p className="text-xs font-semibold text-yt-text-secondary px-3 mb-1">Explore</p>
          <div className="flex flex-col gap-1">
            {exploreSection.map(renderItem)}
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar