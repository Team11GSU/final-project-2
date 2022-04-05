import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { grommet, Grommet } from 'grommet';
import Login from './loginform';

// entry point for app and Parcel
const app = document.getElementById('react');
ReactDOM.render(
    <Grommet theme={grommet}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/loginform" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </Grommet>,
    app,
);
