import images from './logo512.png'


export function Description() {
    

    return(
        <div className="desc-container">
            <div className="left">
                <img src={images}></img>
                <div className="nft-name">
                    <p>NFT LOKI</p>
                </div>
                <button className="buy-btn">BUY NFT</button>
            </div>

            <div className="right">
                <div>
                    <p>lo</p>
                </div>

                <div>
                    
                </div>


            </div>
        </div>
    );
}