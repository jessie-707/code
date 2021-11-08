import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Launcher from './components/Launcher';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Route path='/' component={Launcher} exact />
        <Route path='/login' component={Launcher} exact />
        <Route path='/home' component={Home} exact />
      </BrowserRouter>
    </>
  );
}
