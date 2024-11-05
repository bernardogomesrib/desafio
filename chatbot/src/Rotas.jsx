import React from 'react';
import { Route, Routes } from "react-router-dom";

import Sidebar2 from './components/ui/otherSidebar';

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Sidebar2/> } />
                
            </Routes>
        </>
    )
}

export default Rotas
