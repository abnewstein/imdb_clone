import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMovieList } from "@/lib/fetchers";

const MovieList: React.FC = () => {
  const {
    data: movieList,
    isPending,
    error,
  } = useQuery({
    queryKey: ["movieList"],
    queryFn: fetchMovieList,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-4">Movie List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Producer</TableHead>
            <TableHead>Actors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movieList?.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.id}</TableCell>
              <TableCell>{movie.name}</TableCell>
              <TableCell>{movie.yearOfRelease}</TableCell>
              <TableCell>{movie.producer.name}</TableCell>
              <TableCell>
                {movie.actors.map((actor) => actor.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovieList;
