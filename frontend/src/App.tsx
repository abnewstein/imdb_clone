import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieList from "./components/MovieList";
import AddMovie from "./components/AddMovie";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const App: React.FC = () => {
  return (
    <Router>
      <NavigationMenu className="m-auto flex flex-col justify-between items-center p-4 gap-4">
        <div>
          <h1 className="text-3xl ">IMDB Clone</h1>
        </div>
        <div>
          <NavigationMenuList className="flex items-center gap-4 mb-4">
            <NavigationMenuItem>
              <Link
                to="/"
                className="py-2 px-4 border-2 rounded-md border-gray-900"
              >
                Movie List
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/add-movie"
                className="py-2 px-4 border-2 rounded-md border-gray-900"
              >
                Add Movie
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/add-movie" element={<AddMovie />} />
      </Routes>
    </Router>
  );
};

export default App;
