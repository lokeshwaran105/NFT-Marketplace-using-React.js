import {ethers} from 'ethers';
import '../App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import {nftAddress, nftMarketAddress} from '../config'

import NFTMarket_abi from '../ABI/contracts/NFTMarket.sol/NFTMarket.json';
import NFT_abi from '../ABI/contracts/NFT.sol/NFT.json';

export function MyNFT() {

    const [nfts, setNft] = useState([]);

    useEffect(() => {
        loadNfts();
    }, []);
    

    async function loadNfts(){

        const web3 = new Web3Modal();
        const connection = await web3.connect();
        const provider = new ethers.BrowserProvider(connection);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(nftAddress, NFT_abi.abi, signer);
        const nftMarketContract = new ethers.Contract(nftMarketAddress, NFTMarket_abi.abi, signer);
        const data = await nftMarketContract.fetchMyItems();

        const items = await Promise.all(data.map(async i => {

            const tokenUri = await nftContract.tokenURI(i.tokenId);
            const nft_data = await axios.get(tokenUri);
            let price = ethers.formatUnits(i.price.toString(), 'ether');
            let item = {
                price: price,
                tokenid: i.tokenId,
                owner: i.owner,
                seller: i.seller,
                image: nft_data.data.image,
                description: nft_data.data.description,
                name: nft_data.data.name
            }
            return item
        }));

        setNft(items)

    }


    return(
        <div className='nft-container'>
            {
                nfts.map((nft, i) => (
                    <div key={i} className='nft-card'>
                        <img src={nft.image}/>
                        <p className='nft-name'>Name: {nft.name}</p>
                        <p >Token ID: {nft.tokenid}</p>
                        <p >Item ID: {nft.itemid}</p>
                        
                        <div className='nft-description'>
                            <p className='description'>Description: {nft.description}</p>
                        </div>
                        <div className='nft-price'>
                            <p className='price'>Price: {nft.price} ETH</p>
                        </div>
                        {/* <button className='nft-buy' onClick={() => BuyNFT(nft)}>Buy NFT</button>
                        <button className='nft-delete' onClick={() => deleteNFT(nft)}>Delete</button> */}
                    </div>
                ))
            }
        </div>
    )
}