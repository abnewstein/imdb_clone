import { api } from "@/lib/api";
import type { Movie, Actor, Producer } from "@server/sharedTypes";

export async function fetchMovieList(): Promise<Movie[]> {
  const res = await api.movies.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }
  return res.json();
}

export async function fetchActorList(): Promise<Actor[]> {
  const res = await api.actors.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch actors");
  }
  return res.json();
}

export async function fetchProducerList(): Promise<Producer[]> {
  const res = await api.producers.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch producers");
  }
  return res.json();
}
