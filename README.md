# The Roundest Pokeeeeeeeeeeeeemon

> wwww

## Getting Started

1. Script 실행을 위한 세팅

```bash
npm i -D ts-node
```

```bash
# package.json의 scripts에 추가
"ts-node": "ts-node --compiler-options \"{\\\"module\\\":\\\"commonjs\\\"}\"",
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
