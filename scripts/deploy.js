// const { ethers } = require('ethers');
const hre = require('hardhat');

async function main(){
    const NFTMarket_abi = await hre.ethers.getContractFactory("NFTMarket");
    const NFTMarket = await NFTMarket_abi.deploy();
    
    console.log("NFT Market deployed to",await NFTMarket.getAddress());


    const NFT_abi = await hre.ethers.getContractFactory("NFT");
    const NFT = await NFT_abi.deploy(NFTMarket.getAddress());
    
    console.log("NFT deployed to",await NFT.getAddress());

}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9


