// src/components/MovieList.tsx
import React from "react";
import { observer } from "mobx-react-lite";

const fakeMovieListData = [
  {
    id: 1,
    name: "The Shawshank Redemption",
    yearOfRelease: 1994,
    producerId: 1,
  },
  { id: 2, name: "The Godfather", yearOfRelease: 1972, producerId: 2 },
  { id: 3, name: "The Dark Knight", yearOfRelease: 2008, producerId: 3 },
];

const MovieList: React.FC = observer(() => {
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h1>Movie List</h1>
      <table className="max-w-[800px] m-auto divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producer ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fakeMovieListData.map((movie) => (
            <tr key={movie.id}>
              <td className="px-6 py-4 whitespace-nowrap">{movie.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{movie.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {movie.yearOfRelease}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {movie.producerId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default MovieList;
