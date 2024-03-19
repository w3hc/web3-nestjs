# Web3 Nestjs

Web3 API that uses Nestjs and PostgreSQL.

Standard NFT contract: https://github.com/strat-web3/standard-nft-contracts 

## Install

Create a postgresql database ([docs](https://www.postgresql.org/docs/current/)): 

```shell
psql -h /tmp -U <USERNAME> -d postgres
```

Then in the SQL console:

```sql
CREATE DATABASE <DATABASE_NAME>;
```

Then create a `.env` file on the model the `.env.template` file: 

```
cp .env.template .env
```

Replace `<YOUR_USER_NAME>`, `<YOUR_DB_NAME>`, with your own credentials. 

Then: 

```bash
pnpm install
```

## Test

```bash
pnpm test
```

## Run

```bash
pnpm start
```

or:

```bash
pnpm start:dev
```

You can access the Swagger UI at [`http://localhost:3000/api`](http://localhost:3000/api).

## Prod

```
pnpm start:prod
```

## Versions

- pnpm v8.7.5
- node v20.9.0

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Farcaster](https://warpcast.com/julien-), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).