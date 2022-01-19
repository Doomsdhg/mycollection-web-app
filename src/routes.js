import React from 'react';
import {Routes, Route} from 'react-router-dom';
import MyCollectionsPage from './pages/MyCollectionsPage';
import MainPage from './pages/MainPage';
import AuthenticationPage from './pages/AuthenticationPage';
import SignUpPage from './pages/SignUpPage';
import CreateCollectionPage from './pages/CreateCollectionPage';
import CollectionPage from './pages/CollectionPage';
import ItemPage from './pages/ItemPage';
import SearchPage from './pages/SearchPage';

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/mycollections" element={<MyCollectionsPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/createcollection" element={<CreateCollectionPage />} />
                <Route path="/collectionpage" element={<CollectionPage />} />
                <Route path="/itempage" element={<ItemPage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path="/auth" element={<AuthenticationPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/collectionpage" element={<CollectionPage />} />
                <Route path="/itempage" element={<ItemPage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        )
    }
}