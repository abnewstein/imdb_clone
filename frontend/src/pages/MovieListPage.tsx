import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMovieList } from "@/lib/fetchers";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddMovie from "../components/AddMovie";

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
    <div className="max-w-3xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-4">Movie List</h1>
      {movieList?.length === 0 ? (
        <div>
          No Movies found, Try{" "}
          <Link to="/add-movie" className="italic text-sky-700">
            adding some movies
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Actors</TableHead>
              <TableHead>Plot</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieList?.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.name}</TableCell>
                <TableCell>{movie.yearOfRelease}</TableCell>
                <TableCell>{movie.producer.name}</TableCell>
                <TableCell>
                  {movie.actors.map((actor) => actor.name).join(", ")}
                </TableCell>
                <TableCell>{movie.plot}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="" aria-describedby={undefined}>
                      <DialogTitle>{`Edit the movie details`}</DialogTitle>
                      <AddMovie movieDetails={movie} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MovieList;
