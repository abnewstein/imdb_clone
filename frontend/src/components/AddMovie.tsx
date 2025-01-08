import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useForm } from "@tanstack/react-form";
import { store } from "../store";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddMovie: React.FC = observer(() => {
  useEffect(() => {
    store.fetchActors();
    store.fetchProducers();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      yearOfRelease: "",
      producer: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Add a new Movie</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="yearOfRelease">Year of release</Label>
              <Input
                id="yearOfRelease"
                placeholder="Year of release of the movie"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="plot">Plot</Label>
              <Input id="plot" placeholder="Plot of the movie" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="poster">Poster</Label>
              <Input id="poster" placeholder="Poster of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Actors</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Add Movie</Button>
      </CardFooter>
    </Card>
  );
});

export default AddMovie;
