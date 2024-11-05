import React from 'react';
import { Route, Routes } from "react-router-dom";

import MainProgram from './components/ui/MainProgram';

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <MainProgram/> } />
            </Routes>
        </>
    )
}

export default Rotas
