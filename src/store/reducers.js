import {combineReducers} from 'redux';

function userStateReducer(state = 0, action){
    switch (action.type) {
        case 'LOGIN':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: true,
                email: action.payload.email
            }
        }
        case 'LOGOUT':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: false,
                email: action.payload.email
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

export const setItemId = (itemData) => ({type: 'ITEM_RENDER', payload: {
    itemId: itemData
}})

export const setsearchQuery = (searchQuery) => ({type: 'SEARCH', payload: {
    query: searchQuery
}})

export const setUserData = (userData) => ({type: 'LOGIN', payload: {
    jwt: userData.token,
    userId: userData.userId,
    isAuthenticated: true,
    email: userData.email
}})

export const deleteUserData = () => ({type: 'LOGOUT', payload: {
    jwt: '',
    userId: '',
    isAuthenticated: false,
    email: ''
}})