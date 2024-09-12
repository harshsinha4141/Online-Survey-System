import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import HomePage from './components/HomePage/HomePage';
import Portal from './components/PortalPage/PortalPage';
import Poll from './components/Poll/Poll';
import Id from './components/Id/Id';
import Voter from './components/Voter/Voter'
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import NotFound from './components/NotFound'; // Optional 404 component


import './App.css';

function App() {


    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/admin-portal" element={<Portal />} />
                    <Route path="/poll" element={<Poll />} />
                    <Route path="/id" element={<Id />} />
                    <Route path="/updatePassword" element={<UpdatePassword />} />
                    <Route path="/voter" element={<Voter />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
