/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import { useEffect, useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';
import Image from 'next/image';

export default function Home() {
  const [firstId, setFirstId] = useState(0);
  const [secondId, setSecondId] = useState(0);
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: firstId }], {
    enabled: !!firstId,
  });
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secondId }], {
    enabled: !!secondId,
  });
  const voteMutation = trpc.useMutation(['cast-vote']);

  console.log(firstPokemon.data);

  /**
   ** 서버에서 포켓몬 정보들을 가져오기
   */
  const fetchPokemons = () => {
    const [first, second] = getOptionsForVote();
    setFirstId(first);
    setSecondId(second);
  };

  const voteForRoundest = (selected?: number) => {
    if (selected === firstId) {
      voteMutation.mutate({ votedFor: firstId, votedAgainst: secondId });
    } else {
      voteMutation.mutate({ votedFor: secondId, votedAgainst: firstId });
    }

    fetchPokemons();
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Which Pokémon is the Roundest?</h1>

      <section className="flex h-96 max-w-2xl items-center justify-between rounded-md border border-gray-600 p-8">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(firstId)}
              />

              <div className="p-8">VS</div>

              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(secondId)}
              />
            </>
          )}
      </section>
    </div>
  );
}

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = ({ pokemon, vote }) => {
  return (
    <article className="flex flex-col items-center space-y-2 ">
      <Image width={256} height={256} src={pokemon.spriteUrl ?? ''} />

      <div className="mt-[-2rem] text-center text-xl capitalize">
        {pokemon.name}
      </div>

      <button
        className="w-24 cursor-pointer bg-slate-400 py-1 text-slate-700"
        onClick={vote}
      >
        Rounder
      </button>
    </article>
  );
};
