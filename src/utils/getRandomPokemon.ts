const MAX_DEX_ID = 493;

const getRandomPokemon = (notThisOne?: number): number => {
  //? 랜덤으로 포켓몬을 뽑는데 인자로 주어진 포켓몬은 제외한다.
  const pokeDexNumber = Math.floor(Math.random() * MAX_DEX_ID) + 1;

  if (pokeDexNumber !== notThisOne) return pokeDexNumber;
  return getRandomPokemon(notThisOne);
};

/**
 * ## 투표 대상을 선정하는 함수
 * 임의의 **포켓몬 2개** 정보를 반환
 * @returns [포켓몬1, 포켓몬2]
 */
export const getOptionsForVote = (): [number, number] => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
