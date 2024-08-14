import {ethers} from 'ethers';
import '../App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import {nftAddress, nftMarketAddress} from '../config'

import NFTMarket_abi from '../ABI/contracts/NFTMarket.sol/NFTMarket.json';
import NFT_abi from '../ABI/contracts/NFT.sol/NFT.json';
import { Navigate, useNavigate } from 'react-router';


export function Home() {

    const routers = useNavigate();

    const [nfts, setNft] = useState([]);
    

    useEffect(() => {
        loadNfts();
    }, []);

    async function loadNfts(){

        const provider = new ethers.JsonRpcProvider();
        const nftContract = new ethers.Contract(nftAddress, NFT_abi.abi, provider);
        const nftMarketContract = new ethers.Contract(nftMarketAddress, NFTMarket_abi.abi, provider);
        const data = await nftMarketContract.fetchItems();

        // console.log(data);

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

    async function deleteNFT(nft){

        const web3 = new Web3Modal();
        const connection = await web3.connect();
        const provider = new ethers.BrowserProvider(connection);
        const signer = await provider.getSigner();

        const nftMarketContract = new ethers.Contract(nftMarketAddress, NFTMarket_abi.abi, signer);
        const transaction = await nftMarketContract.DeleteItem(nft.tokenid);
        await transaction.wait();

        console.log("Success")

        loadNfts();

    }

    async function BuyNFT(nft){

        const web3 = new Web3Modal();
        const connection = await web3.connect();

        const provider = new ethers.BrowserProvider(connection);

        const signer = await provider.getSigner();
        const nftMarketContract = new ethers.Contract(nftMarketAddress, NFTMarket_abi.abi, signer);

        const price = ethers.parseUnits(nft.price.toString(), 'ether');

        await (await nftMarketContract.saleNFT(nft.tokenid, nftAddress, {value: price})).wait();

        console.log("Success...");

        loadNfts();
    }

    function descriptionPage() {
        routers('/pages/description');
    }

    if(!nfts.length){
        return(
            <div className='items-not-there'>
                <p className='para'>
                    There are currently no NFTs in the MarketPlace.<br/> Please comeback later
                </p>
            </div>
        )
    }

    return(
        <div className='nft-container'>
            {
                nfts.map((nft, i) => (
                    <div key={i} className='nft-card'>
                        <img src={nft.image}/>
                        <p className='nft-name'>Name: {nft.name}</p>
                        
                        {/* <div className='nft-description'>
                            <p className='description'>Description: {nft.description}</p>
                        </div> */}
                        <div className='nft-price'>
                            <p className='price'>Price: {nft.price} ETH</p>
                        </div>
                        <div className='buttons'>
                            <button className='button nft-buy' onClick={() => BuyNFT(nft)}>Buy NFT</button>
                            <button className='button nft-delete' onClick={() => descriptionPage()}>Details</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}