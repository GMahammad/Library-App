import ExploreTopBooks from "./Components/ExploreTopBooks";
import Carousel from "./Components/Carousel";
import Heros from "./Components/Heros";
import LibraryService from "./Components/LibraryService";

const HomePage = () => {
  return (
    <>
      <ExploreTopBooks />
      <Carousel />
      <Heros />
      <LibraryService />
    </>
  );
};

export default HomePage;
