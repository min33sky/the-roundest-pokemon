import { PokemonClient } from 'pokenode-ts';

//! src 폴더 밖에 위치하므로 '@'를 사용할 수 없다. 상대주소 그대로 적자
import { prisma } from '../src/backend/utils/prisma';

/**
 *## Pokemon API의 data를 내가 만든 DB에 등록하는 함수
 */
const doBackfill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));

  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });

  console.log('Creation?', creation);
};

doBackfill();
