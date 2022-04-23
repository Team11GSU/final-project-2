import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { grommet, Grommet } from 'grommet';
import App from './App';
import Chat from './chat';
import Calendar from './calendar';
import Files from './files';
import TodoPage from './todo';
import UserProfile from './profile';

// entry point for app and Parcel
const container = document.getElementById('react');
const root = createRoot(container);
root.render(
  <Grommet full theme={grommet}>
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/project/:projectID" element={<App />}>
          <Route path="calendar" element={<Calendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="files" element={<Files />} />
          <Route path="todo" element={<TodoPage />} />
          <Route index element={<Navigate to="todo" />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  </Grommet>,
);
