import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import { useEffect, useState } from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [firstId, setFirstId] = useState(0);
  const [secondId, setSecondId] = useState(0);
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: firstId }], {
    enabled: !!firstId,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secondId }], {
    enabled: !!secondId,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const voteMutation = trpc.useMutation(['cast-vote']);

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

  const isLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  // const isLoaded = false;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-base font-bold sm:text-xl md:text-2xl">
        Which Pokémon is the Roundest?
      </h1>

      <section
        className={`flex h-96 w-[90vmin] max-w-2xl items-center  rounded-md border border-gray-600 p-8 ${
          isLoaded ? 'justify-between' : 'justify-center'
        }`}
      >
        {isLoaded && (
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
        {!isLoaded && (
          <Image
            src="/spinner.svg"
            width={48}
            height={48}
            alt="loading_spinner"
          />
        )}
      </section>

      <footer className="absolute bottom-0 grid h-10 w-full place-items-center">
        <Link href={'/result'}>
          <a>Result Page...🚀</a>
        </Link>
      </footer>
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
      <Image
        width={256}
        height={256}
        src={pokemon.spriteUrl ?? ''}
        alt="Pokemon_Image"
      />

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
