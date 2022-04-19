import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { grommet, Grommet } from 'grommet';
import App from './App';
import Login from './loginform';
import Chat from './chat';
import Calendar from './calendar';
import Files from './files';
import TodoPage from './todo';
import UserProfile from './profile'

// entry point for app and Parcel
const app = document.getElementById('react');
ReactDOM.render(
  <Grommet full theme={grommet}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/project/1" />} />
        <Route path="/loginform" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/project/:projectID" element={<App />}>
          <Route path="calendar" element={<Calendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="files" element={<Files />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="members" element={<Members />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </Grommet>,
  app,
);
