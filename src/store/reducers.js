import {combineReducers} from 'redux';
import { REHYDRATE } from 'redux-persist';

function userStateReducer(state = 0, action){
    switch (action.type) {
        case 'LOGIN':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: true,
                email: action.payload.email,
                admin: action.payload.admin
            }
        }
        case 'LOGOUT':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: false,
                email: action.payload.email,
                admin: false
            }
        }
        case 'COLLECTION_RENDER':{
            return {
                ...state,
                collectionId: action.payload.collectionId
            }
        }
        case 'ITEM_RENDER':{
            return {
                ...state,
                itemId: action.payload.itemId
            }
        }
        case 'SEARCH':{
            return {
                ...state,
                query: action.payload.query
            }
        }
        case 'IMAGE_UPLOAD' :{
            return {
                ...state,
                imageURL: action.payload.imageURL
            }
        }
        case 'PROFILE_RENDER' :{
            return {
                ...state,
                profileId: action.payload.profileId
            }
        }
        case 'LANGUAGE_CHANGE' :{
            return {
                ...state,
                language: action.payload.language
            }
        }
        case 'THEME_CHANGE' :{
            return {
                ...state,
                theme: action.payload.theme
            }
        }
        default:
            return state
    }
}

export const rootReducer = combineReducers({
    userData: userStateReducer
})

export const setCollectionId = (collectionData) => ({type: 'COLLECTION_RENDER', payload: {
    collectionId: collectionData
}})

export const setLanguage = (language) => ({type: 'LANGUAGE_CHANGE', payload: {
    language: language
}})

export const setProfileId = (userId) => ({type: 'PROFILE_RENDER', payload: {
    profileId: userId
}})

export const setItemId = (itemData) => ({type: 'ITEM_RENDER', payload: {
    itemId: itemData
}})

export const setSearchQuery = (searchQuery) => ({type: 'SEARCH', payload: {
    query: searchQuery
}})

export const setImageURL = (imageURL) => ({type: 'IMAGE_UPLOAD', payload: {
    imageURL: imageURL
}})

export const setTheme = (theme) => ({type: 'THEME_CHANGE', payload: {
    theme: theme
}})

export const setUserData = (userData) => ({type: 'LOGIN', payload: {
    jwt: userData.token,
    userId: userData.userId,
    isAuthenticated: true,
    email: userData.email,
    admin: userData.admin
}})

export const deleteUserData = () => ({type: 'LOGOUT', payload: {
    jwt: '',
    userId: '',
    isAuthenticated: false,
    email: '',
    admin: false
}})