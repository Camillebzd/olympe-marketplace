# Olympe marketplace

This is a marketplace created with Thirdweb.

## Env

You need to create a `.env.local` file with your template client id from the Thirdweb dashboard:
```
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=
```

**Note:** the marketplace is actually configured for Etherlink Testnet. If you want to change the chain, you will have to change it manually in `pages/token/[contractAddress]/[tokenId].tsx` and `pages/_app.tsx`.

## Contracts

You also have to deploy 2 contracts:
- EtherlinkGenerator from [here](https://github.com/Camillebzd/etherlink-generator)
- Marketplace V3 from thirdweb dashboard [here](https://thirdweb.com/thirdweb.eth/MarketplaceV3)

Then, you need to change the variables in the file: `const/addresses.ts`

## Run

If you want to run it locally, first install the dependencies:
```bash
yarn
```

Then, run:
```bash
yarn dev
```