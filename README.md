# NFT-MarketPlace
This repository hosts the codebase and documentation for a decentralized NFT marketplace built on the Ethereum blockchain using ERC-721 tokens. The marketplace allows users to create, buy, sell, and trade non-fungible tokens representing digital assets.

## Table of Contents
1) Features
2) Installation
3) Usage
4) Architecture
5) Testing
6) Deployment
7) License

## Features
1) ERC-721 Implementation: Utilizes the ERC-721 standard for non-fungible tokens.
2) User Authentication: Users can authenticate and interact with the marketplace securely.
3) Create NFTs: Allows users to mint new NFTs representing digital assets.
4) Buy and Sell NFTs: Facilitates the buying and selling of NFTs between users.
5) Marketplace: Provides a decentralized marketplace for users to discover and trade NFTs.
6) Royalty Mechanism: Includes a royalty mechanism for creators to earn royalties on secondary sales.

## Installation
To set up the project locally, follow these steps:

### Clone the repository:
```bash
git clone https://github.com/lokeshwaran105/NFT-MarketPlace
```
### Install dependencies:
```bash
cd NFT-MarketPlace
```
```bash
npm install
```

### Usage
To run the project locally, use the following command:
```bash
npm start
```
### Testing
Testing is crucial to ensure the reliability and security of the marketplace. We use unit tests and integration tests to cover different aspects of the system. To run tests, use the following command:
```bash
npx hardhat test
```
### Deployment
The marketplace can be deployed on the Ethereum mainnet or testnets like Ropsten, Rinkeby, or Goerli. Follow these steps for deployment:

#### 1) Compile smart contracts:
```bash
npx hardhat compile
```
#### 2) Deploy contracts to the desired network:
```bash
npx hardhat deploy --network <network_name>
```
### License
This project is licensed under the MIT License.
