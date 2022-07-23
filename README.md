# The Roundest Pokeeeeeeeeeeeeemon

> 가장 둥근녀석을 골라보자. 😋

## Stacks

- react
- next
- trpc
- tailwindcss
- planetscale
- prisma

## Getting Started

1. Script 실행을 위한 세팅 (DB의 schema가 설정되어 있어야 한다.)

```bash
# script 실행을 위한 ts-node 설치
npm i -D ts-node

# seed를 추가하는 script 호출
npm run db:seed
"ts-node --compiler-options \"{\\\"module\\\":\\\"commonjs\\\"}\" ./scripts/fill-db.ts"
```

2. Pokemon Data Script 실행

```bash
npm run ts-node ./scripts/fill-db.ts
```

## Note

1. planetscale org 교체

   > pscale org switch [branch_name]

2. planetscale connect

   > pscale connect [DB_NAME] [Branch_name] --port 3309

3. planetscale에서는 **db push migrate**보다 **db prisma push**가 권장된다.
4. `dev` branch로 push한 후 `main` branch로 `deploy` 해야한다.
5. 만약 `deploy`가 안될경우 `main` branch의 데이터를 삭제하는 경우도 생각해보자
