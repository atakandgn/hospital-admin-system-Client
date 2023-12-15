import React from 'react';
import './index.css';
import {
    BrowserRouter, Route, Routes,
} from "react-router-dom";
import NotFound from "./view/404/NotFound";
import AuthenticateUser from "./view/LoginRegister/LoginRegister";
import {Dashboard} from "./view/Dashboard/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthenticateUser/>}/>
                <Route path="/dashboard/:adminID" element={<Dashboard/>} />
                <Route path="*" element={<NotFound/>}/> {/* 404 */}

                {/*<Route path="/services" element={<Services/>}/> */}

            </Routes>
        </BrowserRouter>
    );
}

export default App;
