import React from 'react';
import { prisma } from '@/backend/utils/prisma';
import Head from 'next/head';
import { AsyncReturnType } from '@/utils/inferType';
import Image from 'next/image';
import { GetStaticProps } from 'next';

/**
 *## 투표수로 정렬 된 포켓몬들 데이터를 가져오는 함수
 */
const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: 'desc' },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
    take: 20,
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
  rank: number;
}> = ({ pokemon, rank }) => {
  return (
    <div className="relative flex items-center justify-between border-b p-2">
      <div className="flex items-center">
        <div className="flex items-center pl-4">
          <Image
            src={pokemon.spriteUrl}
            width={64}
            height={64}
            layout="fixed"
            alt="poke_image"
          />
          <div className="pl-2 capitalize">{pokemon.name}</div>
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toFixed(2) + '%'}
      </div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center rounded-br-md border border-gray-500 bg-gray-600 px-2 font-semibold text-white shadow-lg">
        {rank}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Roundest Pokemon Results</title>
      </Head>

      <h2 className="p-4 text-2xl">Results</h2>

      <div className="flex w-full max-w-2xl flex-col border">
        {props.pokemon
          ?.sort((a, b) => {
            const difference =
              generateCountPercent(b) - generateCountPercent(a);

            //? 득표율이 같을 경우에는 득표 수로 결정
            if (difference === 0) {
              return b._count.VoteFor - a._count.VoteFor;
            }

            return difference;
          })
          .map((currentPokemon, index) => {
            return (
              <PokemonListing
                pokemon={currentPokemon}
                key={index}
                rank={index + 1}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  const DAY_IN_SECONDS = 60 * 60 * 24; // 1일 단위로 페이지를 새로 만든다.
  return { props: { pokemon: pokemonOrdered }, revalidate: DAY_IN_SECONDS };
};
