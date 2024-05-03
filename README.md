# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help -> pnpm hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# PNPM

```sh
pnpm add --save-dev hardhat
pnpm hardhat init

# install typescript (not compatible with viem)
pnpm add --save-dev ts-node typescript
pnpm add --save-dev chai@4 @types/node @types/mocha @types/chai@4
pnpm add --save-dev @typechain/hardhat

# install openzeppelin
pnpm add --save-dev @openzeppelin/contracts@4.9.6

# verify etherscan
pnpm hardhat verify --list-networks
pnpm hardhat verify --network {network} {contract address} "constructor argument 1"
pnpm hardhat verify --constructor-args ./arguments/Stock.ts {contract address}

# linter (solhint.json config file)
pnpm add --save-dev @nomiclabs/hardhat-solhint
pnpm hardhat check

# run script
pnpm hardhat run ./scripts/vim/Client.ts

# deploy
pnpm hardhat deploy --tags {tag} --network {network}
```

# VIEM

-   https://viem.sh/docs/introduction.html
-   https://github.com/wevm/viem/tree/main/examples
-   https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-viem

# Solhint

-   https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-solhint
-   https://github.com/protofire/solhint/blob/develop/conf/rulesets/solhint-recommended.js

# Verifying contract

-   https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#usage

## Other

-   https://github.com/Ratimon/eth-encrypt-private-key/tree/main
