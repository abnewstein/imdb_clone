import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MovieListPage from "./pages/MovieListPage";
import AddMoviePage from "./pages/AddMoviePage";
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
          <h1 className="text-3xl">IMDB Clone</h1>
        </div>
        <div>
          <NavigationMenuList className="flex items-center gap-4 mb-4">
            <NavigationMenuItem>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "py-2 px-4 border-2 rounded-md border-violet-700 bg-violet-700 text-white"
                    : "py-2 px-4 border-2 rounded-md border-violet-700"
                }
              >
                Movie List
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink
                to="/add-movie"
                className={({ isActive }) =>
                  isActive
                    ? "py-2 px-4 border-2 rounded-md border-violet-700 bg-violet-700 text-white"
                    : "py-2 px-4 border-2 rounded-md border-violet-700"
                }
              >
                Add Movie
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/movie-list" element={<MovieListPage />} />
        <Route path="/add-movie" element={<AddMoviePage />} />
      </Routes>
    </Router>
  );
};

export default App;
