import axios from "axios";
import { PokeAPI } from "pokeapi-types";

export interface AllPokemons {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export const getAllPokemons = async (url: string): Promise<AllPokemons> => {
  const res = await axios.get(url);
  return res.data;
};

export const getPokemon = async (url: string): Promise<PokeAPI.Pokemon> => {
  const res = await axios.get(url);
  return res.data;
};
