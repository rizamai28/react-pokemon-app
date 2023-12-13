import React from "react";
import { PokeAPI } from "pokeapi-types";

interface CardProps {
  pokemon: PokeAPI.Pokemon;
}

const Card: React.FC<CardProps> = ({ pokemon }) => {
  return (
    <div className="card shadow-md bg-red-50">
      <figure>
        <img
          className=" w-36"
          src={pokemon.sprites.front_default}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title justify-center">{pokemon.name}</h2>
        <div className="flex flex-col items-center">
          <p>
            タイプ: {pokemon.types[0].type.name} {pokemon.types[1]?.type.name}
          </p>
          <p>高さ: {pokemon.height / 10} m</p>
          <p>重さ: {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
