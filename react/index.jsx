import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Grommet, grommet } from 'grommet';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// entry point for app and Parcel
const app = document.getElementById('react');
ReactDOM.render(
    <React.StrictMode>
        <Grommet theme={grommet}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </BrowserRouter>
        </Grommet>
    </React.StrictMode>,
    app,
);
