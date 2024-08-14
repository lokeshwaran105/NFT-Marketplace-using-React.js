import React from "react";

import { Routes, Route  } from "react-router";

import Home from "../pages2/Home";
import Market from "../pages2/Market";
import Create from "../pages2/Create";
import Contact from "../pages2/Contact";
import NFTDetails from "../pages2/NFTDetails";
import Wallets from "../pages2/Wallet";

function Routers(){
    return(
        <Routes>
            <Route path="/" element={Home} />
            <Route path="/market" element={<Market />} />
            <Route path="/create" element={<Create />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wallet" element={<Wallets />} />
            <Route path="/market/:id" element={<NFTDetails />} />
        </Routes>
    );
}

export default Routers;