import { useEffect, useState } from "react";
import "./App.css";
import { AllPokemons, getAllPokemons, getPokemon } from "./utils/pokemon";
import { PokeAPI } from "pokeapi-types";
import Card from "./components/Card";

function App() {
  const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=21";
  const [isdark, setIsdark] = useState(
    JSON.parse(localStorage.getItem("isdark") ?? "false")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allPokemons, setAllPokemons] = useState<AllPokemons>();
  const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>();

  const getPokemonApi = async (url: string) => {
    // すべてのポケモンデータを取得
    const allPokemonData = await getAllPokemons(url);
    // 各ポケモンのデータを取得
    const _pokemons = await Promise.all(
      allPokemonData.results.map(
        async (pokemon) => await getPokemon(pokemon.url)
      )
    );
    return { allPokemonData, _pokemons };
  };

  useEffect(() => {
    getPokemonApi(POKEMON_BASE_URL).then((data) => {
      setPokemons(data._pokemons);
      setAllPokemons(data.allPokemonData);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("isdark", JSON.stringify(isdark));
  }, [isdark]);

  console.log("全部のポケモン", allPokemons);
  console.log(pokemons);

  const onClickPrev = async () => {
    if (!allPokemons?.previous) {
      return;
    }

    setIsLoading(true);
    const { allPokemonData, _pokemons } = await getPokemonApi(
      allPokemons.previous
    );

    setPokemons(_pokemons);
    setAllPokemons(allPokemonData);
    setIsLoading(false);
  };

  const onClickNext = async () => {
    if (!allPokemons?.next) {
      return;
    }
    setIsLoading(true);
    const { allPokemonData, _pokemons } = await getPokemonApi(allPokemons.next);

    setAllPokemons(allPokemonData);
    setPokemons(_pokemons);
    setIsLoading(false);
  };

  return (
    <>
      <div data-theme={isdark ? "night" : "light"}>
        {isLoading ? (
          <h1 className="text-red-300 font-bold text-5xl text-center p-10">
            ローディング中...
          </h1>
        ) : (
          <div>
            <div className="flex items-center justify-center pt-10">
              <h1 className="text-center font-bold text-4xl">ポケモン図鑑</h1>
              <input
                type="checkbox"
                className="toggle theme-controller ml-8"
                onChange={() => {
                  setIsdark(!isdark);
                }}
              />
            </div>
            <div className="p-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pokemons?.map((pokemon) => (
                <Card key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center p-10 pb-20 gap-5">
          <button
            className="btn btn-info text-white w-20"
            onClick={onClickPrev}
          >
            戻る
          </button>
          <button
            className="btn btn-info text-white w-20"
            onClick={onClickNext}
          >
            つぎへ
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
