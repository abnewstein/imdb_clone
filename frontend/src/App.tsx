import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import AddMovie from "./components/AddMovie";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/add-movie" element={<AddMovie />} />
      </Routes>
    </Router>
  );
};

export default App;
