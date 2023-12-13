import { useEffect, useState } from "react";
import "./App.css";
import { AllPokemons, getAllPokemons, getPokemon } from "./utils/pokemon";
import { PokeAPI } from "pokeapi-types";
import Card from "./components/Card";

function App() {
  const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=21";
  const [isLight, setIsLight] = useState(
    JSON.parse(localStorage.getItem("isLight") ?? "false")
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
    localStorage.setItem("isLight", JSON.stringify(isLight));
    const theme = isLight ? "night" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, [isLight]);

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

  const onChangeThemeHandler = () => {
    setIsLight(!isLight);
    const theme = isLight ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <>
      {isLoading ? (
        <h1 className="text-red-300 font-bold text-5xl text-center p-10">
          ローディング中...
        </h1>
      ) : (
        <div>
          <div className="flex items-center justify-center pt-10">
            <h1 className="text-center font-bold text-4xl">ポケモン図鑑</h1>
            <label className="flex items-center cursor-pointer gap-2 ml-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                checked={isLight}
                className="toggle theme-controller"
                onChange={onChangeThemeHandler}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </label>
          </div>
          <div className="p-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pokemons?.map((pokemon) => (
              <Card key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center p-10 pb-20 gap-5">
        <button className="btn btn-info text-white w-20" onClick={onClickPrev}>
          戻る
        </button>
        <button className="btn btn-info text-white w-20" onClick={onClickNext}>
          つぎへ
        </button>
      </div>
    </>
  );
}

export default App;
