# Web3 Nestjs

Nestjs-based API that uses PostgreSQL and Ethersjs.

It mints an NFT. 

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

## Example 

### Request body

```json
{
  "network": 11155111,
  "recipient": "0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d",
  "name": "My NFT",
  "description": "This is description.",
  "creatorName": "Da Vinci",
  "creatorAddress": "0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d",
  "imageUrl": "https://bafybeiakz6ddls5hrcgrcpse3ofuqxx3octuedtapyxnstktyoadtwjjqi.ipfs.w3s.link/",
  "resaleRights": 500,
  "symbol": "MYNFT",
  "redeemable": false
}
```

### Response body

```json
{
  "network": 11155111,
  "tokenId": 1,
  "contract": "0xDDff341dc57260db78F96bBC7dc0c7Aa0Ad4fb67",
  "metadata": {
    "name": "My NFT",
    "description": "This is description.",
    "creatorName": "Da Vinci",
    "creatorAddress": "0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d",
    "image": "ipfs://bafybeigd2n5orm3fy3mbbyrpkkdejz5v5777tge3ygwlubztxgolo2i264",
    "attributes": [
      {
        "trait_type": "Resale rights (%)",
        "value": 5
      },
      {
        "trait_type": "Creator",
        "value": "Da Vinci"
      },
      {
        "trait_type": "Creator wallet address",
        "value": "0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d"
      }
    ]
  },
  "id": "19",
  "contractAddress": "0x000000000000000000000000000000000default",
  "mintHash": "https://sepolia.etherscan.io/tx/0x32bdb2af0f26eec625413f998c1e6766e80db4ce7b6a51de619328d9c0b5f81c",
  "openseaLink": "https://testnets.opensea.io/assets/sepolia/0xDDff341dc57260db78F96bBC7dc0c7Aa0Ad4fb67/1",
  "metadataUrl": "ipfs://bafkreiecdhtpydti7k3klndxfmgfn4hz6xjsdk7fgafcclgg3yhhrusqmy"
}
```

## Versions

- pnpm v8.7.5
- node v20.9.0

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Farcaster](https://warpcast.com/julien-), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).