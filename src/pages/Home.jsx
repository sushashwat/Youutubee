import { use, useState } from "react";
import FilterButtons from '../components/FilterButtons';
import VideoGrid from '../components/VideoGrid';


/**
 * Home Page
 * ----------
 * Route: "/" - shows category filters + video grid.
 * activeCategory state moved here from App.jsx since only this page needs it.
 */

function Home(){
    const [activeCategory, setActiveCategory] = useState('All')

    return(
        <>
        <FilterButtons
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        />
        <VideoGrid activeCategory={activeCategory}/>
        </>
    )
}

export default Home;
