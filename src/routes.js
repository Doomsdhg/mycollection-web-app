import React from 'react';
import {Routes, Route} from 'react-router-dom';
import MyCollectionsPage from './pages/MyCollectionsPage';
import MainPage from './pages/MainPage';
import AuthenticationPage from './pages/AuthenticationPage';
import SignUpPage from './pages/SignUpPage';


export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/mycollections" element={<MyCollectionsPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path="/auth" element={<AuthenticationPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        )
    }
}