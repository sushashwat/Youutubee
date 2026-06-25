import { categories } from '../data/categories'

/**
 * FilterButtons Component
 * ------------------------
 * Horizontal row of category pills shown below the header on the home page.
 *
 * Props:
 *  - activeCategory (string): which category is currently selected (e.g. "All")
 *  - onSelectCategory (function): called with the clicked category name.
 *    Parent (Home page) owns this state and will use it to filter the
 *    videos list in the next step (Video Grid).
 */
function FilterButtons({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 px-1 scrollbar-hide">
      {categories.map((category) => {
        const isActive = category === activeCategory

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium
                        transition-colors
                        ${
                          isActive
                            ? 'bg-yt-black text-yt-white'
                            : 'bg-yt-hover-bg text-yt-black hover:bg-yt-border'
                        }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

export default FilterButtons