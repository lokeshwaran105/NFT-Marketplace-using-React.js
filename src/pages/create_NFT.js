import {useState} from 'react';
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Web3Modal from 'web3modal';
import {nftAddress, nftMarketAddress} from '../config'
import axios from 'axios';
import NFTMarket_abi from '../ABI/contracts/NFTMarket.sol/NFTMarket.json';
import NFT_abi from '../ABI/contracts/NFT.sol/NFT.json';


export function CreateNFT(){

    const routers = useNavigate()

    const [formData, updateFormData] = useState({name:"", price:"", description:""});
    const [fileUrl, setFileUrl] = useState("");

    async function uploadFile(e){

        try {

            const f_data = new FormData();
            f_data.append('file', e);

            const response = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: f_data,
                headers:{
                    pinata_api_key: 'a18ab20f5d795aefff18',
                    pinata_secret_api_key: '7ee42c368893b244e0904453a2db36a0ac8a0f0c48930b909ad6cf4b43d9bde8',
                    "Content-Type": "multipart/form-data",
                }
            });

            // console.log(response)

            const url = `https://azure-recent-bandicoot-927.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=DYIb0v6Q1flSCQ-I7DteLfEyq0TQTEQOH0xeGXBKuBNgMpqOGP4Mbh06K4OfGMS-`;
            
            setFileUrl(url);

        } catch (error) {
            console.log("File is not uploaded...")
        }
    }

    async function createItem(url) {
        
        // const web3 = new Web3Modal();

        // const connection = await web3.connect();

        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        console.log(signer);
        console.log("signer");

        let contract = new ethers.Contract(nftAddress, NFT_abi.abi, signer);

        let transaction = await contract.createToken(url);

        await transaction.wait();

        let token_id =await contract._tokenId();

        const price = ethers.parseUnits(formData.price, 'ether');

        contract = new ethers.Contract(nftMarketAddress, NFTMarket_abi.abi, signer);

        let listingPrice = await contract.listingPrice();

        listingPrice = listingPrice.toString();

        transaction = await contract.CreateItem(price, nftAddress, token_id, {value: listingPrice});

        await transaction.wait()

        console.log("Success....");

        routers("/");

    }

    async function getItemUrl() {
        const {name, price, description} = formData;

        if(!name || !price || !description || !fileUrl){
            return
        }

        const f_data = JSON.stringify({name, description, image: fileUrl});
        // console.log(f_data);

        try{
            const response = await axios({
                method: "POST",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: f_data,
                headers:{
                    pinata_api_key: 'a18ab20f5d795aefff18',
                    pinata_secret_api_key: '7ee42c368893b244e0904453a2db36a0ac8a0f0c48930b909ad6cf4b43d9bde8',
                    "Content-Type": "application/json",
                }
            });

            // console.log(response);
            const url = `https://azure-recent-bandicoot-927.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=DYIb0v6Q1flSCQ-I7DteLfEyq0TQTEQOH0xeGXBKuBNgMpqOGP4Mbh06K4OfGMS-`;
            console.log(url);

            createItem(url);

            // console.log("Success");
            
        }catch(error){
            console.log("Error");
        }

    }

    return(
        <div className='form-container'>
            <div className="form">
                <input className='input input-name' type='text' placeholder='NFT Name' onChange={ (e) => updateFormData({...formData, name: e.target.value})}></input>
                <input className='input input-price' type='text' placeholder='NFT Price' onChange={ (e) => updateFormData({...formData, price: e.target.value})}></input>
                <textarea className='input input-description' type='text' placeholder='NFT Description' onChange={ (e) => updateFormData({...formData, description: e.target.value})}></textarea>
                <input className='input input-file' type='file' onChange={(e) => uploadFile(e.target.files[0])}></input>
                <button className='input submit-data' onClick={() => getItemUrl()}>Buy NFT</button>
            </div>
        </div>
    )
}
