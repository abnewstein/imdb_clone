import { makeAutoObservable } from "mobx";
import { api } from "./lib/api";
import type { Actor, Producer } from "@server/sharedTypes";

export type Movie = {
  id: number;
  name: string;
  yearOfRelease: number;
  producerId: number;
};

class Store {
  movies = [];
  actors: Actor[] = [];
  producers: Producer[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchActors() {
    try {
      const response = await api.actors.$get();
      if (response.ok) {
        this.actors = await response.json();
      }
    } catch (error) {
      console.error("Error fetching actors: ", error);
    }
  }

  async fetchProducers() {
    try {
      const response = await api.producers.$get();
      if (response.ok) {
        this.producers = await response.json();
      }
    } catch (error) {
      console.error("Error fetching producers: ", error);
    }
  }
}

export const store = new Store();
